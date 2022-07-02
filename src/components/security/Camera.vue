<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <q-list>
        <q-item class="q-py-md">
          <q-item-section>
            <q-item-label class="text-weight-medium"
              >Security Camera</q-item-label
            >
            <q-item-label caption>Live stream</q-item-label>
          </q-item-section>
        </q-item>

        <div class="relative-position">
          <video
            id="video"
            autoplay
            muted
            controls
            loop
            class="full-width rounded-borders block"
          ></video>

          <q-spinner-puff
            color="primary"
            size="64px"
            class="absolute-center"
            v-if="isLoading"
          />
        </div>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
const DEVICE_SECURITY = process.env.DEVICE_DB + "/" + process.env.SECURITY_DB;

const RTC_CONFIG = {
  sdpSemantics: "unified-plan",
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ],
  iceCandidatePoolSize: 2
};

export default {
  name: "Camera",
  data() {
    return {
      SDP_REF:
        this.$store.getters["auth/user"].uid + "/" + DEVICE_SECURITY + "/sdp",
      pc: null,
      isLoading: true
    };
  },
  methods: {
    negotiate(pc) {
      pc.addTransceiver("video", { direction: "recvonly" });
      // pc.addTransceiver("audio", { direction: "recvonly" });

      return pc
        .createOffer()
        .then(offer => {
          return pc.setLocalDescription(offer);
        })
        .then(() => {
          return new Promise(resolve => {
            if (pc.iceGatheringState === "complete") {
              resolve();
            } else {
              const checkState = () => {
                if (pc.iceGatheringState === "complete") {
                  pc.removeEventListener("icegatheringstatechange", checkState);
                  resolve();
                }
              };
              pc.addEventListener("icegatheringstatechange", checkState);
            }
          });
        })
        .then(() => {
          return this.$firebase
            .database()
            .ref(this.SDP_REF)
            .set({
              sdp: pc.localDescription.sdp,
              type: pc.localDescription.type
            });
        })
        .then(() => {
          return new Promise(resolve => {
            let sdpRef = this.$firebase.database().ref(this.SDP_REF);
            sdpRef.on("value", snapshot => {
              const sdp = snapshot.val();
              if (sdp.type === "answer") {
                sdpRef.off();
                resolve(sdp);
              }
            });
          });
        })
        .then(answer => {
          return pc.setRemoteDescription(answer);
        })
        .catch(error => {
          console.log(error);
        });
    },
    start() {
      const signalRef = this.$firebase.database().ref(this.SIGNAL_REF);

      var pc = new RTCPeerConnection(RTC_CONFIG);

      // FOR DEBUGGING ONLY
      // pc.addEventListener("icegatheringstatechange", () => {
      //   console.log(`ICE gathering state changed: ${pc.iceGatheringState}`);
      // });
      // pc.addEventListener("connectionstatechange", () => {
      //   console.log(`Connection state change: ${pc.connectionState}`);
      // });
      // pc.addEventListener("signalingstatechange", () => {
      //   console.log(`Signaling state change: ${pc.signalingState}`);
      // });
      // pc.addEventListener("iceconnectionstatechange ", () => {
      //   console.log(`ICE connection state change: ${pc.iceConnectionState}`);
      // });
      // FOR DEBUGGING ONLY

      pc.addEventListener("track", event => {
        if (event.track.kind === "video") {
          document.getElementById("video").srcObject = event.streams[0];
        }
      });

      pc.addEventListener("signalingstatechange", () => {
        if (pc.signalingState === "stable") {
          this.isLoading = false;
        }
      });

      this.negotiate(pc);
      this.pc = pc;
    },
    stop() {
      if (this.pc) {
        this.pc.close();
      }
    }
  },
  mounted() {
    this.start();
  },
  beforeDestroy() {
    this.stop();
  }
};
</script>
