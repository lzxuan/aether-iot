<template>
  <q-item clickable :to="to">
    <q-item-section avatar class="link-icon">
      <q-icon :name="icon" :class="iconClass" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ subtitle }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "Link",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    iconClass: {
      type: String,
      default: ""
    },
    to: {
      type: String,
      default: ""
    }
  }
};
</script>
