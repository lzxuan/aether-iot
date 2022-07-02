<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input
      outlined
      v-model="message.name"
      label="Your Name"
      lazy-rules
      :rules="[val => (!!val && /\S/.test(val)) || 'Please type something']"
    />

    <q-input
      outlined
      v-model="message.message"
      label="Your Message"
      type="textarea"
      lazy-rules
      :rules="[val => (!!val && /\S/.test(val)) || 'Please type something']"
    />

    <div class="text-right">
      <q-btn label="Reset" type="reset" color="primary" flat class="q-mr-sm" />
      <q-btn label="Submit" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script>
const DEVICE_DB = process.env.DEVICE_DB;
const MESSAGES_DB = process.env.MESSAGES_DB;

export default {
  name: "MessageForm",
  data() {
    return {
      message: {
        name: "",
        message: ""
      }
    };
  },
  methods: {
    onSubmit() {
      this.$firebase
        .firestore()
        .collection(MESSAGES_DB)
        .doc(this.$route.params.id)
        .collection(DEVICE_DB)
        .add({
          timestamp: this.$firebase.firestore.FieldValue.serverTimestamp(),
          name: this.message.name,
          message: this.message.message
        })
        .then(() => {
          this.$emit("submit");
        });
    },
    onReset() {
      this.name = "";
      this.message = "";
    }
  }
};
</script>
