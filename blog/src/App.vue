<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<template>
  <NavBar />
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <BackToTop />
</template>
