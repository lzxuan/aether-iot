<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <q-item class="q-pa-md">
        <q-item-section>
          <q-item-label class="text-h6">Living Room Lights</q-item-label>
        </q-item-section>

        <div class="q-pa-sm">
          <q-rating
            v-model="brightness"
            @input="setBrightness"
            size="3em"
            icon="emoji_objects"
            no-reset
            :max="3"
            :color-selected="brightnessColors"
          />
        </div>

        <div class="q-pa-sm">
          <q-btn-toggle
            v-model="lights"
            @click="toggleLights"
            :disable="disableLights"
            no-caps
            rounded
            unelevated
            toggle-color="orange"
            color="white"
            text-color="orange"
            size="15px"
            :options="[
              { label: 'Off', value: false },
              { label: 'On', value: true }
            ]"
          />
        </div>
      </q-item>

      <template>
        <q-card-actions align="around" class="q-pa-none">
          <q-toggle
            v-model="schedule"
            dense="dense"
            @input="toggleSchedule"
            class="text-subtitle1"
            label="Schedule"
            color="orange"
            icon="schedule"
            size="70px"
          />

          <q-toggle
            v-model="sensorMode"
            dense="dense"
            @input="toggleSensorMode"
            class="text-subtitle1"
            label="Sensor Mode"
            color="orange"
            icon="directions_run"
            size="70px"
          />
        </q-card-actions>

        <div class="q-pa-md">
          <q-expansion-item
            v-model="schedule"
            @input="toggleSchedule"
            icon="schedule"
            label="Set Schedule"
            caption="For Daily"
            class="text-subtitle1"
          >
            <q-card>
              <q-card-actions align="around">
                <label>On Time</label>
                <label>Off Time</label>
              </q-card-actions>
              <q-card-actions align="around">
                <q-btn
                  color="orange"
                  icon-right="access_time"
                  :label="onTime"
                  style="max-width: 250px"
                  size="20px"
                  class="q-px-md"
                >
                  <q-popup-proxy
                    @before-show="updateProxy(onTime)"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="proxyTime" color="orange">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancel"
                          color="orange"
                          flat
                          v-close-popup
                        />
                        <q-btn
                          label="OK"
                          color="orange"
                          @click="setOnTime"
                          flat
                          v-close-popup
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-btn>

                <q-btn
                  color="orange"
                  icon-right="access_time"
                  :label="offTime"
                  style="max-width: 250px"
                  size="20px"
                  class="q-px-md"
                >
                  <q-popup-proxy
                    @before-show="updateProxy(offTime)"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="proxyTime" color="orange">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancel"
                          color="orange"
                          flat
                          v-close-popup
                        />
                        <q-btn
                          label="OK"
                          color="orange"
                          @click="setOffTime"
                          flat
                          v-close-popup
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-btn>
              </q-card-actions>
            </q-card>
          </q-expansion-item>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
const DEVICE_LIGHTING = process.env.DEVICE_DB + "/" + process.env.LIGHTING_DB;

export default {
  data() {
    return {
      LIGHTING_REF:
        this.$store.getters["auth/user"].uid + "/" + DEVICE_LIGHTING,
      brightness: 1,
      brightnessColors: ["light-orange-6", "orange", "orange-9"],
      lights: false,
      disableLights: false,
      schedule: false,
      onTime: "",
      offTime: "",
      proxyTime: "",
      sensorMode: false
    };
  },
  methods: {
    setBrightness() {
      this.updateControlState(
        this.LIGHTING_REF + "/brightness",
        this.brightness,
        {
          message: "Brightness Status Updated",
          color: (this.bightness = "orange")
        }
      );
    },
    toggleLights() {
      this.updateControlState(this.LIGHTING_REF + "/lights", this.lights, {
        message: "Lights Status Updated",
        color: this.lights ? "orange" : "grey"
      });
    },
    toggleSchedule() {
      this.updateControlState(
        this.LIGHTING_REF + "/schedule/scheduleStatus",
        this.schedule,
        {
          message: "Schedule Status Updated",
          color: this.schedule ? "orange" : "grey"
        }
      );
    },
    setOnTime() {
      this.onTime = this.proxyTime;
      this.updateControlState(
        this.LIGHTING_REF + "/schedule/onTime",
        this.onTime,
        { message: "On Time Updated", color: this.onTime ? "orange" : "grey" }
      );
    },
    setOffTime() {
      this.offTime = this.proxyTime;
      this.updateControlState(
        this.LIGHTING_REF + "/schedule/offTime",
        this.offTime,
        { message: "Off Time Updated", color: this.offTime ? "orange" : "grey" }
      );
    },
    updateProxy(time) {
      this.proxyTime = time;
    },
    toggleSensorMode() {
      if (this.sensorMode) {
        this.disableLights = true;
      } else {
        this.disableLights = false;
      }
      this.updateControlState(
        this.LIGHTING_REF + "/sensorMode",
        this.sensorMode,
        {
          message: "Sensor Mode Status Updated",
          color: this.sensorMode ? "orange" : "grey"
        }
      );
    },
    updateControlState(ref, state, notification) {
      this.$firebase
        .database()
        .ref(ref)
        .set(state, error => {
          if (error) {
            console.log(error);
          } else {
            if (notification) {
              this.$q.notify({
                progress: true,
                message: notification.message,
                color: notification.color
              });
            }
          }
        });
    }
  },
  mounted() {
    this.$firebase
      .database()
      .ref(this.LIGHTING_REF)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          if (typeof snapshot.val().lights !== "undefined") {
            this.lights = snapshot.val().lights;
          }
          if (typeof snapshot.val().brightness !== "undefined") {
            this.brightness = snapshot.val().brightness;
          }
          if (typeof snapshot.val().schedule !== "undefined") {
            if (typeof snapshot.val().schedule.scheduleStatus !== "undefined") {
              this.schedule = snapshot.val().schedule.scheduleStatus;
            }
            if (typeof snapshot.val().schedule.onTime !== "undefined") {
              this.onTime = snapshot.val().schedule.onTime;
            }
            if (typeof snapshot.val().schedule.offTime !== "undefined") {
              this.offTime = snapshot.val().schedule.offTime;
            }
          }
          if (typeof snapshot.val().sensorMode !== "undefined") {
            this.disableLights = snapshot.val().sensorMode;
            this.sensorMode = snapshot.val().sensorMode;
          }
        }
      });

    this.$firebase
      .database()
      .ref(this.LIGHTING_REF + "/lights")
      .on("value", snapshot => {
        this.lights = snapshot.val();
      });
  }
};
</script>
