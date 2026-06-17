<script setup lang="ts">
import type { Post } from '../types'
defineProps<{ post: Post }>()
</script>

<template>
  <router-link :to="`/blog/${post.id}`" class="post-card reveal">
    <span class="kicker">{{ post.category }}</span>
    <h3 class="post-title">{{ post.title }}</h3>
    <p class="post-summary">{{ post.summary }}</p>
    <div class="post-meta">
      <span>{{ post.date }}</span>
      <span class="dot"></span>
      <span v-if="post.readingTime">{{ post.readingTime }} 分钟</span>
    </div>
  </router-link>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
  border-top: 1px solid var(--rule);
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-fast);
}
.post-card:hover { transform: translateY(-2px); }
.post-title {
  font-size: 18px;
  margin: 10px 0 8px;
  color: var(--ink);
  line-height: 1.3;
  transition: color var(--transition-fast);
}
.post-card:hover .post-title { color: var(--accent); }
.post-summary {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-muted);
  flex: 1;
  margin-bottom: 14px;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-faint);
}
.dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--text-faint);
}
</style>
