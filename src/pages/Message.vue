<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="col-12 col-sm-10 col-md-8 col-lg-6">
        <h6 class="text-center text-gradient-primary text-weight-bolder q-mt-md q-mb-sm">
          Aether IoT
        </h6>
        <q-card-section>
          <component :is="currentComponent" @submit="onSubmit"></component>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import MessageForm from "components/message/MessageForm";
import MessageSuccess from "components/message/MessageSuccess";

export default {
  name: "Message",
  data() {
    return {
      currentComponent: MessageForm
    };
  },
  methods: {
    onSubmit() {
      this.currentComponent = MessageSuccess;
    }
  }
};
</script>
