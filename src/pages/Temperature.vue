<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <FanControl />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Dialog, date } from "quasar";
import FanControl from "components/temperature/FanControl.vue";

export default {
  name: "Temperature",
  components: { FanControl }
};
</script>
