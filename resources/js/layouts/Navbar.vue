<script setup lang="ts">
import useNavbar from '@/composables/layouts/navbar'
import { usePage, Link, router } from '@inertiajs/vue3'
import { computed, watch } from 'vue'

const page = usePage()
const currentRoute = computed(() => page.url)

const {
  isMobile,
  clientFullName,
  clientFormattedRole,
  avatarSize,
  menuItems,
  notificaciones,
  currentTitle,
  searchTerm,
  drawer,
} = useNavbar()

watch(searchTerm, (newTerm) => {
  const path = '/client/Home_Cli'
  if (newTerm.trim()) {
    router.replace({ url: `${path}?term=${newTerm.trim()}` })
  } else {
    router.replace({ url: path })
  }
})
</script>

<template>
  <div>
    <!-- APP BAR -->
    <v-app-bar elevation="0" class="custom-app-bar">
      <v-container fluid class="pa-0">
        <v-row align="center" justify="space-between" no-gutters class="w-100 mt-2">
          <v-col cols="auto" class="pl-2" v-if="isMobile">
            <v-btn icon @click="drawer = !drawer">
              <v-icon color="#08093F">mdi-menu</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="auto" class="pl-2 text-title">
            <h1 class="font-weight-bold">{{ currentTitle }}</h1>
          </v-col>

          <v-col class="d-flex justify-center flex-grow-1 px-2">
            <v-text-field v-model="searchTerm" placeholder="Buscar..." prepend-inner-icon="mdi-magnify"
              append-icon="mdi-microphone" solo dense hide-details class="custom-search" />
          </v-col>

          <v-col v-if="!isMobile" cols="auto" class="d-flex align-center pr-2">
            <!-- Notificaciones -->
            <v-menu offset-y left>
              <template #activator="{ props }">
                <v-btn icon class="custom-notification" v-bind="props">
                  <v-badge v-if="notificaciones.length" color="red" :content="notificaciones.length">
                    <v-icon color="#08093F">mdi-bell</v-icon>
                  </v-badge>
                  <v-icon v-else color="#08093F">mdi-bell</v-icon>
                </v-btn>
              </template>
              <v-card width="350px">
                <v-list style="max-height: 400px; overflow-y: auto">
                  <div
                    v-for="(noti, index) in notificaciones"
                    :key="index"
                    class="notification-item"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <span class="notification-title">{{ noti.titulo }}</span>
                      <small class="text-muted">{{ noti.fecha }}</small>
                    </div>
                    <p class="notification-text">{{ noti.mensaje }}</p>
                    <v-divider v-if="index !== notificaciones.length - 1" />
                  </div>
                </v-list>
              </v-card>
            </v-menu>

            <!-- Usuario -->
            <div class="d-flex align-center ml-4">
              <div class="d-flex flex-column text-right mr-3">
                <span class="text-primary font-weight-medium">{{ clientFullName }}</span>
                <small class="text-muted">{{ clientFormattedRole }}</small>
              </div>
              <v-avatar :size="avatarSize" class="grey lighten-2" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- DRAWER MOBILE -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      class="custom-drawer"
    >
      <div class="user-info">
        <div class="close-button">
          <v-btn icon @click="drawer = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>
        <v-avatar size="60" class="avatar-overlay mb-2" />
        <div class="user-text">
          <span class="text-primary font-weight-medium">{{ clientFullName }}</span>
          <p class="mb-0">{{ clientFormattedRole }}</p>
        </div>
      </div>

      <v-list>
        <Link
          v-for="item in menuItems"
          :key="item.route"
          :href="item.route"
          :class="{ 'active-menu-item': currentRoute === item.route }"
        >
          <v-list-item clickable>
            <template #prepend>
              <v-badge
                v-if="item.route === '/client/Notifications_Cli' && notificaciones.length"
                color="red"
                :content="notificaciones.length"
              >
                <v-icon color="#29235C">{{ item.icon }}</v-icon>
              </v-badge>
              <v-icon v-else color="#29235C">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="menu-text">{{ item.text }}</v-list-item-title>
          </v-list-item>
        </Link>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/layouts/navbar.scss" as *;
</style>
