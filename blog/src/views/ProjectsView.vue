<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import projectsData from '../data/projects.json'
import ProjectCard from '../components/ProjectCard.vue'
import type { Project } from '../types'

const projects = projectsData as Project[]
const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)
useSeo({
  title: '作品 - 小满的技术随笔',
  description: '刘小满的前端项目作品集。'
})
</script>

<template>
  <div class="projects container" ref="rootRef">
    <header class="page-head reveal">
      <span class="kicker">Works</span>
      <h1>作品</h1>
      <p class="subtitle">前端实践里做过的一些项目</p>
    </header>
    <div class="grid">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<style scoped>
.projects {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head { text-align: center; margin-bottom: 44px; }
.page-head h1 { font-size: clamp(28px, 5vw, 40px); margin: 10px 0 6px; }
.subtitle { color: var(--text-muted); font-size: 15px; }
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}
@media (max-width: 720px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
