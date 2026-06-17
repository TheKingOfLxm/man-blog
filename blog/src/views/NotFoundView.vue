<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found container">
    <div class="nf-inner">
      <div class="code">404</div>
      <p class="line">此页如雪夜孤舟，不可寻也。</p>
      <button class="btn btn-primary" @click="router.push('/')">回到首页</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--nav-height);
}
.nf-inner { text-align: center; }
.code {
  font-family: var(--font-display);
  font-size: clamp(72px, 16vw, 140px);
  font-weight: 600;
  color: var(--ink);
  opacity: 0.14;
  line-height: 1;
  margin-bottom: 16px;
}
.line {
  font-family: var(--font-serif-cn);
  color: var(--text-body);
  margin-bottom: 28px;
  font-size: 16px;
}
</style>
