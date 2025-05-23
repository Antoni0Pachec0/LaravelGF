<template>
  <v-app>
    <Sidebar v-if="!isMobile" />
    <Navbar v-else />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from '@/layouts/Sidebar.vue'
import Navbar from '@/layouts/Navbar.vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
const isMobile = smAndDown
</script>
