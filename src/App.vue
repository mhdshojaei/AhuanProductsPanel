<script setup lang="ts">
  import { snackbar } from '@/composables/useApi';
</script>

<template>
  <v-locale-provider rtl>
    <v-app>
      <v-main>
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="4000"
          location="top left">
          {{ snackbar.text }}
        </v-snackbar>
        <router-view />
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
