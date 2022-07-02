<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-gradient-blue">
      <q-toolbar>
        <q-toolbar-title>
          {{ $route.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "GuestLayout"
};
</script>
