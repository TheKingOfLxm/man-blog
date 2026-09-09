<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import projectsData from '../data/projects.json'
import ProjectCard from '../components/ProjectCard.vue'
import AppIcon from '../components/AppIcon.vue'
import type { Project } from '../types'

const projects = projectsData as Project[]
const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)
useSeo({
  title: '作品 - 小满的技术随笔',
  description:
    '刘小满的 GitHub 项目精选：古代科技可视化、校园商会管理系统、即我与个人博客。',
})
</script>

<template>
  <div class="projects container" ref="rootRef">
    <header class="page-head reveal">
      <span class="kicker">Selected works</span>
      <h1>作品</h1>
      <div class="head-bottom">
        <p class="subtitle">
          从跨端业务到 3D 可视化，把想法写成可以探索的作品。
        </p>
        <a
          class="github-link"
          href="https://github.com/TheKingOfLxm?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AppIcon name="github" :size="16" /> 全部 GitHub 仓库
          <AppIcon name="diagonal" :size="14" />
        </a>
      </div>
    </header>
    <div class="collection-meta reveal">
      <span>{{ String(projects.length).padStart(2, '0') }} / GITHUB 精选</span>
      <span>持续构建，保持好奇。</span>
    </div>
    <div class="grid">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :index="index"
      />
    </div>
  </div>
</template>

<style scoped>
.projects {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head {
  text-align: center;
  margin-bottom: 44px;
}
.page-head h1 {
  font-size: clamp(28px, 5vw, 40px);
  margin: 10px 0 6px;
}
.subtitle {
  color: var(--text-muted);
  font-size: 15px;
}
.head-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}
.github-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--text-body);
  font-size: 12px;
}
.github-link:hover {
  color: var(--accent);
}
.collection-meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
  color: var(--text-muted);
  font: 10px var(--font-mono);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
