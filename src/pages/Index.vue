<template>
  <q-page class="flex flex-center">
    <q-list bordered separator class="rounded-borders">
      <q-item>
        <q-toolbar class="q-pt-sm">
          <q-toolbar-title
            class="text-center text-gradient-primary text-weight-bolder text-h4"
          >
            Aether IoT
          </q-toolbar-title>
        </q-toolbar>
      </q-item>

      <Link v-for="link in links" :key="link.title" v-bind="link" />
    </q-list>
  </q-page>
</template>

<script>
import Link from "components/Link.vue";

const linksData = [
  {
    title: "Lighting",
    subtitle: "Control and manage your lights",
    icon: "wb_incandescent",
    iconClass: "text-gradient-yellow",
    to: "lighting"
  },
  {
    title: "Temperature",
    subtitle: "Control and manage your fans",
    icon: "cloud",
    iconClass: "text-gradient-blue",
    to: "temperature"
  },
  {
    title: "Security",
    subtitle: "Monitor your security camera",
    icon: "verified_user",
    iconClass: "text-gradient-green",
    to: "security"
  }
];

export default {
  name: "Index",
  components: { Link },
  data() {
    return {
      links: linksData
    };
  }
};
</script>
