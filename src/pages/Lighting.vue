<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <LightingControls />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Dialog, date } from "quasar";
import LightingControls from "components/lighting/LightingControls.vue";

export default {
  name: "Lighting",
  components: { LightingControls }
};
</script>
