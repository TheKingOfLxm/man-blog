<script setup lang="ts">
import type { Project } from '../types'
import AppIcon from './AppIcon.vue'
import ProjectCover from './ProjectCover.vue'

withDefaults(defineProps<{ project: Project; index?: number }>(), { index: 0 })
</script>

<template>
  <article class="project-card reveal">
    <a
      class="project-cover-link"
      :href="project.source"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`在 GitHub 查看${project.title}`"
    >
      <ProjectCover :project="project" :index="index" />
    </a>
    <div class="project-body">
      <span class="project-category">{{ project.category }}</span>
      <h3>
        <a :href="project.source" target="_blank" rel="noopener noreferrer">
          {{ project.title }} <AppIcon name="diagonal" :size="18" />
        </a>
      </h3>
      <p>{{ project.description }}</p>
      <ul class="project-highlights" aria-label="项目亮点">
        <li v-for="highlight in project.highlights" :key="highlight">
          {{ highlight }}
        </li>
      </ul>
      <div class="project-bottom">
        <div class="project-tags">
          <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="project-links">
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`查看${project.title}演示`"
            >体验 <AppIcon name="diagonal" :size="13"
          /></a>
          <a
            :href="project.source"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`查看${project.title}源码`"
            >源码 <AppIcon name="github" :size="14"
          /></a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-surface);
  transition: border-color 0.3s;
}
.project-card:hover,
.project-card:focus-within {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}
.project-cover-link {
  display: block;
}
.project-cover-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -3px;
}
.project-body {
  padding: 26px;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.project-category {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 11px;
}
.project-body h3 {
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 500;
  line-height: 1.5;
}
.project-body h3 a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.project-body h3 svg {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.3s;
}
.project-body h3 a:hover svg {
  color: var(--accent);
  transform: translate(2px, -2px);
}
.project-body > p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.9;
  margin-top: 12px;
}
.project-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  list-style: none;
  padding: 0;
  margin: 18px 0 25px;
}
.project-highlights li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--text-body);
}
.project-highlights li::before {
  content: '';
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--accent);
}
.project-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid var(--border-soft);
  margin-top: auto;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 12px;
}
.project-tags span {
  font: 9px var(--font-mono);
  color: var(--text-muted);
}
.project-links {
  display: flex;
  gap: 14px;
  margin-left: auto;
}
.project-links a {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 11px;
  min-height: 28px;
  color: var(--ink);
  white-space: nowrap;
}
.project-links a:hover {
  color: var(--accent);
}
@media (max-width: 640px) {
  .project-body {
    padding: 22px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-body h3 svg {
    transition: none;
  }
}
</style>
