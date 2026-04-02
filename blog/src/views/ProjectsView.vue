<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import projectsData from '../data/projects.json'
import type { Project } from '../types'

const projects = projectsData as Project[]

useScrollReveal()

useSeo({
  title: '作品集 - 小满的博客',
  description: '刘小满的前端项目作品集，包括个人博客、待办事项应用、天气查询应用等 Vue 3 项目。'
})
</script>

<template>
  <div class="projects-page">
    <div class="container">
      <section class="projects-header">
        <h1 class="reveal">作品集</h1>
        <p class="subtitle reveal">两年前端学习路上完成的项目</p>
      </section>

      <div class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card glass glass-hover reveal"
          v-glow
        >
          <div class="project-image">
            <img :src="project.image" :alt="project.title" loading="lazy" />
          </div>
          <div class="project-body">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="project-links">
              <a
                v-if="project.demo"
                :href="project.demo"
                target="_blank"
                class="btn btn-primary btn-sm"
              >
                查看 Demo
              </a>
              <a
                v-if="project.source"
                :href="project.source"
                target="_blank"
                class="btn btn-outline btn-sm"
              >
                源码
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
  min-height: 100vh;
}

.projects-header {
  text-align: center;
  margin-bottom: 48px;
}

.projects-header h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 16px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
}

.project-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all var(--transition-fast);
}

.project-image {
  height: 200px;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-body h3 {
  font-size: 20px;
  font-weight: 700;
}

.project-body p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.project-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.project-links {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.btn-sm {
  padding: 8px 18px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
