<script setup lang="ts">
import { computed, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import postsData from '../data/posts.json'
import projectsData from '../data/projects.json'
import Masthead from '../components/Masthead.vue'
import Epigraph from '../components/Epigraph.vue'
import FeaturedPost from '../components/FeaturedPost.vue'
import PostCard from '../components/PostCard.vue'
import ProjectCard from '../components/ProjectCard.vue'
import type { Post, Project } from '../types'

const posts = postsData as Post[]
const projects = (projectsData as Project[]).slice(0, 2)

// 精选：featured:true 优先，否则取最新一篇
const featured = computed(() => posts.find(p => p.featured) ?? posts[0])
const recent = computed(() => {
  const f = featured.value
  return posts.filter(p => p.id !== f.id).slice(0, 3)
})

const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)

useSeo({
  title: '小满的技术随笔 - 前端开发者',
  description: '刘小满的技术随笔，记录 Vue、CSS、工程化等前端实践里的思考、踩坑与避坑。',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '小满的技术随笔',
    description: '记录前端实践里的思考、踩坑与避坑',
    author: { '@type': 'Person', name: '刘小满' }
  }
})
</script>

<template>
  <div class="home container" ref="rootRef">
    <Masthead />
    <Epigraph />

    <FeaturedPost v-if="featured" :post="featured" class="reveal" />

    <div class="section-label reveal">
      <span class="num">01 —</span>
      <h2>最新文章</h2>
      <router-link to="/blog" class="more">查看全部 →</router-link>
    </div>
    <div class="recent-grid">
      <PostCard v-for="post in recent" :key="post.id" :post="post" />
    </div>

    <div class="section-label reveal">
      <span class="num">02 —</span>
      <h2>精选作品</h2>
      <router-link to="/projects" class="more">全部作品 →</router-link>
    </div>
    <div class="projects-grid">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: var(--nav-height);
  padding-bottom: 80px;
}
.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media (max-width: 900px) {
  .recent-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .recent-grid { grid-template-columns: 1fr; }
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
