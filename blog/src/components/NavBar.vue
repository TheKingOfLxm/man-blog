<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '博客' },
  { path: '/projects', label: '作品集' },
  { path: '/about', label: '关于' }
]

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav class="navbar" :class="{ scrolled, open: menuOpen }">
    <div class="navbar-inner container">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">◆</span>
        <span class="logo-text">小满的博客</span>
      </RouterLink>

      <div class="nav-right">
        <div class="nav-links">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            :class="{ active: route.path === link.path || (link.path !== '/' && route.path.startsWith(link.path)) }"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </div>
        <ThemeToggle />
      </div>

      <button class="hamburger" @click="toggleMenu" :class="{ active: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" v-if="menuOpen">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="mobile-link"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-height);
  transition: all var(--transition-normal);
}

.navbar.scrolled {
  background: var(--bg-nav);
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 20px var(--shadow-color);
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
  font-size: 20px;
  font-weight: 700;
  color: var(--text-heading);
  text-decoration: none;
}

.logo-icon {
  color: var(--color-primary);
  font-size: 22px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-body);
  font-weight: 500;
  font-size: 15px;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
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
  width: 22px;
  height: 2px;
  background: var(--text-heading);
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 16px 24px;
  background: var(--bg-nav);
  backdrop-filter: blur(var(--blur-amount));
  border-bottom: 1px solid var(--border-color);
}

.mobile-link {
  padding: 12px 0;
  color: var(--text-body);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
}

.mobile-link:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .nav-right {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
