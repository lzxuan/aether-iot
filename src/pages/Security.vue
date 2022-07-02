<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <Camera />
      </div>

      <div class="col-12 col-md-4">
        <Controls />
      </div>

      <div class="col-12">
        <Messages />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Dialog, date } from "quasar";
import Camera from "components/security/Camera.vue";
import Controls from "components/security/Controls.vue";
import Messages from "components/security/Messages.vue";

export default {
  name: "Security",
  components: { Camera, Controls, Messages }
};
</script>
