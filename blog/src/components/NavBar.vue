<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWindowScroll, useEventListener, useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import AppIcon from './AppIcon.vue'
const emit = defineEmits<{ search: [] }>()
const menuOpen = ref(false)
const isMobile = useMediaQuery('(max-width: 760px)')
watch(isMobile, () => {
  menuOpen.value = false
})
const { y } = useWindowScroll()
const route = useRoute()
const links = [
  { path: '/', label: '首页', en: 'Home' },
  { path: '/blog', label: '文章', en: 'Writing' },
  { path: '/projects', label: '作品', en: 'Works' },
  { path: '/about', label: '关于', en: 'About' },
]
watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') menuOpen.value = false
})
</script>
<template>
  <nav
    class="navbar"
    :class="{ scrolled: y > 16, expanded: menuOpen }"
    aria-label="主导航"
  >
    <div class="navbar-inner container">
      <router-link to="/" class="logo" aria-label="小满的技术随笔 · 首页"
        ><span class="logo-symbol" aria-hidden="true">✳</span
        ><span>小满<span class="logo-dot">.</span></span
        ><span class="logo-caption"
          >A DEVELOPER'S<br />PERSONAL JOURNAL</span
        ></router-link
      >
      <div class="nav-links">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{
            active:
              route.path === link.path ||
              (link.path !== '/' && route.path.startsWith(link.path)),
          }"
          ><span>{{ link.label }}</span
          ><small>{{ link.en }}</small></router-link
        >
      </div>
      <div class="nav-actions">
        <button
          class="search-btn"
          @click="emit('search')"
          aria-label="搜索文章"
        >
          <AppIcon name="search" :size="16" /><kbd>⌘ K</kbd></button
        ><ThemeToggle /><button
          class="menu-toggle"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        >
          <span :class="{ open: menuOpen }"></span
          ><span :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>
    <div v-if="menuOpen" id="mobile-nav" class="mobile-menu">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        @click="menuOpen = false"
        >{{ link.label }} <small>{{ link.en }}</small
        ><AppIcon name="diagonal"
      /></router-link>
    </div>
  </nav>
</template>
<style scoped>
.navbar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--nav-height);
  border-bottom: 1px solid var(--border-soft);
  transition: background 0.3s;
}
.navbar.scrolled,
.navbar.expanded {
  background: color-mix(in srgb, var(--bg-page) 88%, transparent);
  backdrop-filter: blur(22px);
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 24px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.07em;
  white-space: nowrap;
}
.logo-symbol {
  font-size: 35px;
  line-height: 1;
  color: var(--accent);
}
.logo-dot {
  color: var(--accent);
}
.logo-caption {
  border-left: 1px solid var(--border);
  padding-left: 15px;
  margin-left: 8px;
  font: 8px/1.6 var(--font-mono);
  letter-spacing: 0.07em;
  color: var(--text-muted);
}
.nav-links {
  display: flex;
  gap: 34px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--text-muted);
  font-size: 12px;
  position: relative;
}
.nav-link small {
  font-size: 10px;
  opacity: 0.6;
}
.nav-link::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  left: 50%;
  bottom: -13px;
  background: var(--accent);
  scale: 0;
  transition: scale 0.2s;
}
.nav-link:hover,
.nav-link.active {
  color: var(--ink);
}
.nav-link.active::after {
  scale: 1;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  padding: 10px;
}
.search-btn kbd {
  font: 10px var(--font-mono);
  border: 1px solid var(--border);
  padding: 2px 5px;
  border-radius: 4px;
}
.menu-toggle {
  display: none;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  background: transparent;
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.menu-toggle span {
  width: 14px;
  height: 1px;
  background: var(--ink);
  transition: transform 0.2s;
}
.menu-toggle span.open:first-child {
  transform: translateY(3px) rotate(45deg);
}
.menu-toggle span.open:last-child {
  transform: translateY(-3px) rotate(-45deg);
}
.mobile-menu {
  background: var(--bg-page);
  padding: 10px 24px 24px;
  border-bottom: 1px solid var(--border);
}
.mobile-menu a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 0;
  border-bottom: 1px solid var(--border-soft);
  color: var(--ink);
}
.mobile-menu small {
  color: var(--text-muted);
}
.mobile-menu svg {
  margin-left: auto;
}
@media (max-width: 1000px) {
  .logo-caption {
    display: none;
  }
  .nav-links {
    gap: 24px;
  }
}
@media (max-width: 760px) {
  .nav-links {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
  .search-btn kbd {
    display: none;
  }
  .nav-actions {
    gap: 8px;
  }
  .logo {
    font-size: 24px;
  }
}
</style>
