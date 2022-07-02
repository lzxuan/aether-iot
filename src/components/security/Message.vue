<template>
  <q-item>
    <q-item-section>
      <q-item-label v-if="name" class="ellipsis">{{ name }}</q-item-label>
      <q-item-label class="text-grey-7">{{ message }}</q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption>{{ timestamp }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "Message",
  props: {
    name: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: ""
    },
    timestamp: {
      type: String,
      default: ""
    }
  }
};
</script>
