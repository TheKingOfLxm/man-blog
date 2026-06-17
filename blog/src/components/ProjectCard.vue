<script setup lang="ts">
import type { Project } from '../types'
defineProps<{ project: Project }>()
</script>

<template>
  <article class="project-card reveal">
    <div class="project-image">
      <img :src="project.image" :alt="project.title" loading="lazy" />
    </div>
    <div class="project-body">
      <h3 class="project-title">{{ project.title }}</h3>
      <p class="project-desc">{{ project.description }}</p>
      <div class="project-tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="project-links">
        <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener" class="btn btn-primary btn-sm">查看 Demo</a>
        <a v-if="project.source" :href="project.source" target="_blank" rel="noopener" class="btn btn-outline btn-sm">源码</a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
}
.project-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow);
  transform: translateY(-3px);
}
.project-image {
  height: 180px;
  background: linear-gradient(135deg, var(--bg-surface-alt), var(--border));
  overflow: hidden;
}
.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}
.project-card:hover .project-image img { transform: scale(1.04); }
.project-body {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.project-title { font-size: 19px; color: var(--ink); }
.project-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.65; }
.project-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.project-links { display: flex; gap: 10px; margin-top: 4px; }
</style>
