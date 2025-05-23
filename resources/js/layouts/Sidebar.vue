<script setup lang="ts">
import useSidebar from '@/composables/layouts/sidebar'

const {
  isLargeScreen,
  isCollapsed,
  menuItems,
  isSelected,
  toggleMenu,
  logout,
} = useSidebar()
</script>

<template>
  <v-navigation-drawer
    v-if="isLargeScreen"
    :permanent="!isCollapsed"
    color="#08093F"
    dark
    :width="isCollapsed ? 100 : 250"
    class="custom-sidebar"
  >
    <!-- Logo -->
    <div class="logo-container">
      <v-img
        :src="isCollapsed ? '/img/Logo_min.png' : '/img/Logo.png'"
        contain
        height="80"
        class="logo-img"
      />
    </div>

    <!-- Menú principal -->
    <v-list nav dense>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.route"
        link
        :active="isSelected(item.route)"
        class="menu-item"
        :class="{ 'selected-item': isSelected(item.route) }"
      >
        <template #prepend>
          <v-icon :class="{ 'selected-icon': isSelected(item.route) }">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title
          v-if="!isCollapsed"
          :class="{ 'selected-text': isSelected(item.route) }"
        >
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Espaciador -->
    <v-spacer></v-spacer>

    <!-- Cerrar sesión -->
    <v-list dense>
      <v-list-item @click="logout" class="logout-item" link>
        <template #prepend>
          <v-icon>mdi-logout</v-icon>
        </template>
        <v-list-item-title v-if="!isCollapsed">Salir</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Botón colapsar menú -->
    <v-btn icon @click="toggleMenu" class="toggle-btn" dark>
      <v-icon>{{ isCollapsed ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
@use "@/styles/layouts/sidebar.scss" as *;
</style>
