<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <q-list separator class="bg-grey-2">
        <q-item class="q-py-md bg-white">
          <q-item-section>
            <q-item-label class="text-weight-medium"
              >Security Controls</q-item-label
            >
            <q-item-label caption>Click to change the state</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="toggleAlarm">
          <q-item-section avatar>
            <q-avatar
              :class="alarm.color"
              text-color="white"
              :icon="alarm.icon"
            />
          </q-item-section>
          <q-item-section>{{ alarm.label }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="toggleLock">
          <q-item-section avatar>
            <q-avatar
              :class="lock.color"
              text-color="white"
              :icon="lock.icon"
            />
          </q-item-section>
          <q-item-section>{{ lock.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
const CONTROL_DB =
  process.env.DEVICE_DB + "/" + process.env.SECURITY_DB + "/control";

const CONTROL_UI = {
  alarm: {
    true: {
      value: true,
      color: "bg-gradient-red",
      icon: "notifications",
      label: "Alarm On"
    },
    false: {
      value: false,
      color: "bg-gradient-green",
      icon: "o_notifications_off",
      label: "Alarm Off"
    }
  },
  lock: {
    true: {
      value: true,
      color: "bg-gradient-green",
      icon: "lock",
      label: "Door Locked"
    },
    false: {
      value: false,
      color: "bg-gradient-red",
      icon: "lock_open",
      label: "Door Unlocked"
    }
  }
};

export default {
  name: "Controls",
  data() {
    return {
      CONTROL_REF: this.$store.getters["auth/user"].uid + "/" + CONTROL_DB,
      alarm: CONTROL_UI.alarm.false,
      lock: CONTROL_UI.lock.true
    };
  },
  methods: {
    setAlarmUI(state) {
      this.alarm = state ? CONTROL_UI.alarm.true : CONTROL_UI.alarm.false;
    },
    setLockUI(state) {
      this.lock = state ? CONTROL_UI.lock.true : CONTROL_UI.lock.false;
    },
    confirmationUI(title, message, onOk) {
      this.$q
        .dialog({
          title: title,
          message: message,
          cancel: true
        })
        .onOk(() => {
          onOk();
        });
    },
    toggleAlarm() {
      const updateAlarmState = (state, notification) => {
        this.updateControlState(
          this.CONTROL_REF + "/alarm",
          state,
          this.setAlarmUI,
          notification
        );
      };

      if (!this.alarm.value) {
        // currently off
        this.confirmationUI(
          "Alarm Confirmation",
          "Confirm turning on the alarm?",
          () => {
            updateAlarmState(true, {
              message: "Alarm turned on!",
              color: "red"
            });
          }
        );
      } else {
        updateAlarmState(false, {
          message: "Alarm turned off!",
          color: "green"
        });
      }
    },
    toggleLock() {
      const updateLockState = (state, notification) => {
        this.updateControlState(
          this.CONTROL_REF + "/lock",
          state,
          this.setLockUI,
          notification
        );
      };

      if (this.lock.value) {
        // currently locked
        this.confirmationUI(
          "Lock Confirmation",
          "Confirm unlocking the door?",
          () => {
            updateLockState(false, { message: "Door unlocked!", color: "red" });
          }
        );
      } else {
        updateLockState(true, { message: "Door locked!", color: "green" });
      }
    },
    updateControlState(ref, state, setControlUI, notification) {
      this.$firebase
        .database()
        .ref(ref)
        .set(state, error => {
          if (error) {
            console.log(error);
          } else {
            setControlUI(state);
            this.$q.notify({
              progress: true,
              message: notification.message,
              color: notification.color
            });
          }
        });
    }
  },
  mounted() {
    this.$firebase
      .database()
      .ref(this.CONTROL_REF)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          if (typeof snapshot.val().alarm !== "undefined") {
            this.setAlarmUI(snapshot.val().alarm);
          }
          if (typeof snapshot.val().lock !== "undefined") {
            this.setLockUI(snapshot.val().lock);
          }
        }
      });
  }
};
</script>
