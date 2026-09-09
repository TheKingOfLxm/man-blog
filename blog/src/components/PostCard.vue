<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../types'
import AppIcon from './AppIcon.vue'
const props = defineProps<{ post: Post; index?: number }>()
const categoryName = computed(
  () =>
    ({
      Vue: 'DEVELOPMENT',
      CSS: 'DESIGN & MOTION',
      工程化: 'ENGINEERING',
      随笔: 'LIFE & THOUGHTS',
    })[props.post.category] || 'JOURNAL',
)
</script>
<template>
  <router-link :to="`/blog/${post.id}`" class="post-card reveal">
    <div class="post-top">
      <span class="kicker">{{ categoryName }}</span
      ><span class="post-number">{{
        String((index ?? 0) + 1).padStart(2, '0')
      }}</span>
    </div>
    <h3>{{ post.title }}</h3>
    <p class="post-summary">{{ post.summary }}</p>
    <div class="post-bottom">
      <div class="post-meta">
        <span>{{ post.date.replaceAll('-', '.') }}</span
        ><span> / </span><span>{{ post.readingTime || 1 }} MIN READ</span>
      </div>
      <span class="card-arrow"><AppIcon name="diagonal" :size="17" /></span>
    </div>
  </router-link>
</template>
<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  padding: 27px;
  background: linear-gradient(
    145deg,
    var(--bg-surface),
    color-mix(in srgb, var(--bg-page) 50%, var(--bg-surface))
  );
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: inherit;
  overflow: hidden;
  transition:
    border-color 0.3s,
    background 0.3s;
}
.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 25%;
  right: 25%;
  height: 1px;
  background: var(--accent);
  opacity: 0;
  box-shadow: 0 0 40px 7px #c2f87c20;
  transition: opacity 0.3s;
}
.post-card:hover {
  border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
}
.post-card:hover::before {
  opacity: 1;
}
.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kicker {
  font-size: 9px;
  letter-spacing: 0.1em;
}
.post-number {
  font: 10px var(--font-mono);
  color: var(--text-faint);
}
.post-card h3 {
  font-size: 19px;
  font-weight: 500;
  line-height: 1.65;
  margin: 22px 0 12px;
  transition: color 0.2s;
}
.post-card:hover h3 {
  color: var(--accent);
}
.post-summary {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.9;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.post-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 25px;
  padding-top: 18px;
  border-top: 1px solid var(--border-soft);
}
.post-meta {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  font: 9px var(--font-mono);
  color: var(--text-muted);
}
.card-arrow {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--ink);
  transition:
    background 0.2s,
    color 0.2s,
    rotate 0.3s;
}
.post-card:hover .card-arrow {
  background: var(--accent);
  color: var(--on-accent);
  rotate: 45deg;
}
</style>
