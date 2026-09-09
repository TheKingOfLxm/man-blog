<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import BackToTop from './components/BackToTop.vue'
import SearchOverlay from './components/SearchOverlay.vue'
import SiteFooter from './components/SiteFooter.vue'

const searchOpen = ref(false)
</script>

<template>
  <a class="skip-link" href="#main-content">跳至正文</a>
  <NavBar @search="searchOpen = true" />
  <main id="main-content" tabindex="-1">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <SiteFooter />
  <BackToTop />
  <SearchOverlay v-model:open="searchOpen" />
</template>
