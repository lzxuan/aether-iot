<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-gradient-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ $route.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-toolbar class="bg-white">
        <q-toolbar-title class="text-center text-gradient-primary text-weight-bolder">
          Aether IoT
        </q-toolbar-title>
      </q-toolbar>

      <q-separator class="q-mb-sm" />

      <q-list spaced>
        <Link v-for="link in links" :key="link.title" v-bind="link" />

        <q-separator spaced />

        <q-item clickable @click="signOut">
          <q-item-section avatar class="link-icon">
            <q-icon name="exit_to_app" class="text-gradient-gray" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sign Out</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
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
  name: "MainLayout",
  components: { Link },
  data() {
    return {
      leftDrawerOpen: false,
      links: linksData
    };
  },
  methods: {
    async signOut() {
      await firebase.auth().signOut();
      this.$router.replace("/signin");
    }
  }
};
</script>
