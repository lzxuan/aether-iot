<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <q-list separator class="bg-grey-2">
        <q-item class="q-py-md bg-white">
          <q-item-section>
            <q-item-label class="text-weight-medium"
              >Doorstep Messages</q-item-label
            >
            <q-item-label caption>Last 30 records</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :value="displayQR" @input="toggleQR">
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[0, 0]"
              >
                Display QR code
              </q-tooltip>
            </q-toggle>
          </q-item-section>
        </q-item>

        <Message v-for="(message, i) in messages" :key="i" v-bind="message" />
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from "quasar";
import Message from "components/security/Message.vue";

const DEVICE_DB = process.env.DEVICE_DB;
const MESSAGES_DB = process.env.MESSAGES_DB;
const DEVICE_SECURITY = DEVICE_DB + "/" + process.env.SECURITY_DB;

const formatDate = d => {
  return date.formatDate(d, "DD/MM/YYYY hh:mm:ssa");
};

export default {
  name: "Messages",
  components: { Message },
  data() {
    return {
      SECURITY_REF:
        this.$store.getters["auth/user"].uid + "/" + DEVICE_SECURITY,
      displayQR: true,
      messages: [],
      unsubscribe: null
    };
  },
  methods: {
    toggleQR() {
      this.$firebase
        .database()
        .ref(this.SECURITY_REF + "/displayQR")
        .set(!this.displayQR, error => {
          if (error) {
            console.log(error);
          } else {
            this.displayQR = !this.displayQR;
          }
        });
    }
  },
  mounted() {
    this.$firebase
      .database()
      .ref(this.SECURITY_REF + "/displayQR")
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          this.displayQR = snapshot.val();
        }
      });

    this.unsubscribe = this.$firebase
      .firestore()
      .collection(MESSAGES_DB)
      .doc(this.$store.getters["auth/user"].uid)
      .collection(DEVICE_DB)
      .orderBy("timestamp", "desc")
      .limit(30)
      .onSnapshot(snapshot => {
        this.messages = [];
        snapshot.forEach(doc => {
          let data = doc.data();
          this.messages.push({
            timestamp: formatDate(data.timestamp.toDate()),
            name: data.name,
            message: data.message
          });
        });
      });
  },
  beforeDestroy() {
    if (this.unsubscribe !== null) this.unsubscribe();
  }
};
</script>
