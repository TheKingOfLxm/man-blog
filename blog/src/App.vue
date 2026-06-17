<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import BackToTop from './components/BackToTop.vue'
const searchOpen = ref(false)
</script>

<template>
  <NavBar @search="searchOpen = true" />
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <BackToTop />
</template>
