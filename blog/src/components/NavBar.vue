<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const emit = defineEmits<{ (e: 'search'): void }>()

const scrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '文章' },
  { path: '/projects', label: '作品' },
  { path: '/about', label: '关于' }
]

function handleScroll() {
  scrolled.value = window.scrollY > 16
}
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav class="navbar" :class="{ scrolled }" aria-label="主导航">
    <div class="navbar-inner container">
      <RouterLink to="/" class="logo">
        <span class="logo-mark">◆</span>
        <span class="logo-text">小满的技术随笔</span>
      </RouterLink>

      <div class="nav-right">
        <div class="nav-links" role="menubar">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            :class="{ active: route.path === link.path || (link.path !== '/' && route.path.startsWith(link.path)) }"
            role="menuitem"
            @click="menuOpen = false"
          >{{ link.label }}</RouterLink>
        </div>
        <button class="icon-btn search-btn" @click="emit('search')" aria-label="搜索文章">⌕</button>
        <ThemeToggle />
      </div>

      <button class="hamburger" @click="toggleMenu" :class="{ active: menuOpen }" aria-label="切换菜单" :aria-expanded="menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu" v-if="menuOpen" role="menu">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="mobile-link"
        role="menuitem"
        @click="menuOpen = false"
      >{{ link.label }}</RouterLink>
      <button class="mobile-link mobile-search" @click="emit('search'); menuOpen = false">⌕ 搜索文章</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--nav-height);
  transition: background var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: color-mix(in srgb, var(--bg-page) 82%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom-color: var(--border);
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.logo-mark {
  color: var(--accent);
  font-size: 15px;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.nav-links {
  display: flex;
  gap: 4px;
}
.nav-link {
  padding: 7px 14px;
  font-family: var(--font-sans);
  color: var(--text-body);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.nav-link:hover {
  color: var(--accent);
}
.nav-link.active {
  color: var(--ink);
  font-weight: 600;
}
.icon-btn {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-body);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.icon-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 20px; height: 2px;
  background: var(--ink);
  border-radius: 2px;
  transition: all var(--transition-fast);
}
.hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 10px 24px 18px;
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
}
.mobile-link {
  padding: 13px 0;
  color: var(--text-body);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid var(--border-soft);
  text-align: left;
  background: none;
  border-left: none; border-right: none; border-top: none;
  cursor: pointer;
  font-family: var(--font-sans);
}
@media (max-width: 768px) {
  .nav-right { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
}
</style>
