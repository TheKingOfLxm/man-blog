<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import postsData from '../data/posts.json'
import type { Post } from '../types'

const posts = postsData as Post[]
const selectedCategory = ref('全部')
const searchQuery = ref('')

const categories = ['全部', ...new Set(posts.map(p => p.category))]

const filteredPosts = computed(() => {
  return posts.filter(post => {
    const matchCategory = selectedCategory.value === '全部' || post.category === selectedCategory.value
    const matchSearch = !searchQuery.value || post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

useScrollReveal()
</script>

<template>
  <div class="blog-page">
    <div class="container">
      <section class="blog-header">
        <h1 class="reveal">技术博客</h1>
        <p class="subtitle reveal">记录学习路上的思考与实践</p>
      </section>

      <div class="filters reveal">
        <div class="category-filter">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        <input
          v-model="searchQuery"
          class="search-input glass"
          type="text"
          placeholder="搜索文章..."
        />
      </div>

      <div class="posts-grid">
        <router-link
          v-for="post in filteredPosts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          class="post-card glass glass-hover reveal"
          v-glow
        >
          <span class="tag">{{ post.category }}</span>
          <h3>{{ post.title }}</h3>
          <p>{{ post.summary }}</p>
          <div class="post-meta">
            <span class="post-date">{{ post.date }}</span>
            <div class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="mini-tag">{{ tag }}</span>
            </div>
          </div>
        </router-link>
      </div>

      <div v-if="filteredPosts.length === 0" class="empty-state reveal">
        <p>没有找到匹配的文章</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
  min-height: 100vh;
}

.blog-header {
  text-align: center;
  margin-bottom: 40px;
}

.blog-header h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 16px;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 18px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: transparent;
  color: var(--text-body);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.search-input {
  padding: 10px 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-body);
  background: var(--bg-card);
  outline: none;
  width: 240px;
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  border-color: var(--color-primary);
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

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.post-date {
  font-size: 13px;
  color: var(--text-muted);
}

.post-tags {
  display: flex;
  gap: 4px;
}

.mini-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
