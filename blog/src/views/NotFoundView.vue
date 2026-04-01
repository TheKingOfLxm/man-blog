<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found-page">
    <div class="container">
      <div class="error-content">
        <div class="error-code">404</div>
        <h1>页面走丢了</h1>
        <p>你访问的页面不存在，可能已被移动或删除。</p>
        <button class="btn btn-primary" @click="router.push('/')">回到首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--nav-height);
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  color: var(--color-primary);
  opacity: 0.2;
  line-height: 1;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  margin-bottom: 12px;
}

p {
  color: var(--text-muted);
  margin-bottom: 32px;
}
</style>
