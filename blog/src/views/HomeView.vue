<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { useTypewriter } from '../composables/useTypewriter'
import postsData from '../data/posts.json'
import projectsData from '../data/projects.json'
import type { Post, Project } from '../types'

const posts = (postsData as Post[]).slice(0, 3)
const projects = (projectsData as Project[]).slice(0, 2)

const { display: typedText } = useTypewriter([
  '专注 Vue 前端开发',
  '热爱 CSS 动画与交互',
  '持续学习，持续分享',
  '把细节打磨到位'
], 80, 40, 2000)

useScrollReveal()
</script>

<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="avatar-wrapper reveal">
          <div class="avatar">🏔️</div>
        </div>
        <h1 class="hero-title reveal">你好，我是刘小满</h1>
        <div class="typewriter-wrapper reveal">
          <span class="typewriter-text">{{ typedText }}</span>
          <span class="cursor">|</span>
        </div>
        <div class="skill-tags reveal">
          <span class="tag">Vue</span>
          <span class="tag">TypeScript</span>
          <span class="tag">CSS</span>
          <span class="tag">Vite</span>
          <span class="tag">Pinia</span>
          <span class="tag">Node.js</span>
        </div>
        <div class="hero-actions reveal">
          <router-link to="/projects" class="btn btn-primary">查看作品</router-link>
          <router-link to="/blog" class="btn btn-outline">阅读博客</router-link>
        </div>
      </div>
    </section>

    <!-- 最近文章 -->
    <section class="section recent-posts">
      <div class="container">
        <h2 class="section-title reveal">最近文章</h2>
        <div class="posts-grid">
          <router-link
            v-for="post in posts"
            :key="post.id"
            :to="`/blog/${post.id}`"
            class="post-card glass glass-hover reveal"
            v-glow
          >
            <span class="tag post-category">{{ post.category }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.summary }}</p>
            <span class="post-date">{{ post.date }}</span>
          </router-link>
        </div>
        <div class="section-footer reveal">
          <router-link to="/blog" class="btn btn-outline">查看全部文章 →</router-link>
        </div>
      </div>
    </section>

    <!-- 精选项目 -->
    <section class="section recent-projects">
      <div class="container">
        <h2 class="section-title reveal">精选项目</h2>
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
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-footer reveal">
          <router-link to="/projects" class="btn btn-outline">查看全部作品 →</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--nav-height);
}

.hero-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar-wrapper {
  margin-bottom: 8px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--bg-card);
  backdrop-filter: blur(var(--blur-amount));
  border: 3px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  box-shadow: 0 8px 30px var(--shadow-color);
}

.hero-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 500px;
}

.typewriter-wrapper {
  font-size: 20px;
  color: var(--color-primary);
  font-weight: 600;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  font-weight: 300;
  color: var(--color-primary);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.section {
  padding: 80px 0;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.post-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.post-card h3 {
  font-size: 18px;
  font-weight: 600;
}

.post-card p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}

.post-date {
  font-size: 13px;
  color: var(--text-muted);
}

.post-category {
  align-self: flex-start;
}

.section-footer {
  text-align: center;
  margin-top: 40px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
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

.project-placeholder {
  font-size: 48px;
  font-weight: 800;
  color: var(--color-primary);
  opacity: 0.3;
}

.project-info {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-info h3 {
  font-size: 18px;
}

.project-info p {
  font-size: 14px;
  color: var(--text-muted);
}

.project-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
    max-width: 260px;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
