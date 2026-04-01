<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import postsData from '../data/posts.json'
import type { Post } from '../types'

const route = useRoute()
const router = useRouter()

const posts = postsData as Post[]
const post = ref<Post | undefined>(undefined)
const renderedContent = ref('')
const articleRef = ref<HTMLElement | null>(null)

interface TocItem {
  id: string
  text: string
  level: number
}
const tocItems = ref<TocItem[]>([])
const activeHeading = ref('')

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
      } catch { /* fallback */ }
    }
    return '<pre class="hljs"><code>' + MarkdownIt.prototype.utils.escapeHtml(str) + '</code></pre>'
  }
})

const currentIndex = computed(() => posts.findIndex(p => p.id === route.params.id))
const prevPost = computed(() => currentIndex.value > 0 ? posts[currentIndex.value - 1] : null)
const nextPost = computed(() => currentIndex.value < posts.length - 1 ? posts[currentIndex.value + 1] : null)

onMounted(async () => {
  const id = route.params.id as string
  post.value = posts.find(p => p.id === id)

  if (post.value) {
    try {
      const modules = import.meta.glob('../../public/posts/*.md', { eager: true, query: '?raw', import: 'default' })
      const raw = modules[`../../public/posts/${post.value.id}.md`]
      renderedContent.value = md.render(raw as string || getFallbackContent(post.value.id))
    } catch {
      renderedContent.value = md.render(getFallbackContent(post.value.id))
    }

    await nextTick()
    extractToc()
    setupScrollSpy()
  }
})

function extractToc() {
  if (!articleRef.value) return
  const headings = articleRef.value.querySelectorAll('h2, h3')
  const items: TocItem[] = []
  headings.forEach((h, i) => {
    const id = `heading-${i}`
    h.id = id
    items.push({ id, text: (h as HTMLElement).textContent || '', level: parseInt(h.tagName[1]) })
  })
  tocItems.value = items
}

function setupScrollSpy() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )
  tocItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

function getFallbackContent(id: string): string {
  const contents: Record<string, string> = {
    'vue3-reactive-principle': `## 前言\n\n用 Vue 写了大半年项目，一直好奇 \`ref\` 和 \`reactive\` 底层到底是怎么工作的。最近花了几天时间读源码 + 写 demo，总算搞明白了，记录一下。\n\n## 核心机制：Proxy\n\nVue 3 的响应式基于 ES6 的 \`Proxy\`，取代了 Vue 2 的 \`Object.defineProperty\`。\n\n\`\`\`javascript\nconst state = reactive({ count: 0 })\n// 实际上发生了这件事：\nconst proxy = new Proxy({ count: 0 }, {\n  get(target, key) {\n    track(target, key)  // 收集依赖\n    return target[key]\n  },\n  set(target, key, value) {\n    target[key] = value\n    trigger(target, key)  // 触发更新\n    return true\n  }\n})\n\`\`\`\n\n## effect：响应式的引擎\n\n每次读取响应式数据时，当前正在运行的 effect 会被收集为依赖。数据变化时，所有依赖它的 effect 会重新执行。\n\n\`\`\`javascript\nwatchEffect(() => {\n  console.log(state.count) // 这里读取了 count，触发 track\n})\n\nstate.count++ // 触发 trigger，上面的回调重新执行\n\`\`\`\n\n## ref 的实现\n\nref 比 reactive 简单，它用一个对象包了一层，通过 \`get/set\` 拦截 \`.value\` 的读写。\n\n\`\`\`javascript\nfunction ref(value) {\n  return {\n    get value() { track(this, 'value'); return value },\n    set value(nv) { value = nv; trigger(this, 'value') }\n  }\n}\n\`\`\`\n\n## computed 的秘密\n\ncomputed 本质上是一个带缓存的 effect。只有依赖变了才重新计算，否则直接返回缓存值。\n\n## 实际开发中的体会\n\n理解了原理之后，下面这些问题就迎刃而解了：\n\n- 为什么解构 reactive 对象会丢失响应性？→ 因为拿到的不再是 Proxy\n- 为什么 ref 要 \`.value\` 而 reactive 不用？→ ref 靠 getter/setter，reactive 靠 Proxy\n- computed 什么时候缓存失效？→ 依赖的响应式数据变化时\n\n## 总结\n\nVue 3 的响应式系统设计得很精巧。不需要背原理，动手写一个简易版 \\\\(50 行代码就够了\\\\)，理解会比看十篇文章都深。`,
    'pinia-state-management': `## 为什么从 Vuex 迁移到 Pinia\n\n大三做项目的时候还在用 Vuex，那时候觉得 mutations 和 actions 的区分很烦——改个数据还得写 mutation，异步还得写 action。\n\n后来导师推荐试试 Pinia，一试就回不去了。\n\n## Pinia 的优势\n\n### 1. 没有 mutations 了\n\n\`\`\`typescript\n// Vuex\nmutations: {\n  setCount(state, val) { state.count = val }\n},\nactions: {\n  async fetchCount({ commit }) {\n    const res = await api.getCount()\n    commit('setCount', res.data)\n  }\n}\n\n// Pinia\nactions: {\n  async fetchCount() {\n    const res = await api.getCount()\n    this.count = res.data  // 直接改，完事\n  }\n}\n\`\`\`\n\n### 2. 完美的 TypeScript 支持\n\n不需要写那些繁琐的类型声明文件，Pinia 天然支持类型推导。\n\n### 3. 更轻量\n\nPinia 约 1KB，API 更简洁，不需要嵌套模块。\n\n## 我的使用模式\n\n\`\`\`typescript\n// stores/user.ts\nexport const useUserStore = defineStore('user', () => {\n  const name = ref('刘小满')\n  const isLoggedIn = ref(false)\n\n  function login() { isLoggedIn.value = true }\n  function logout() { isLoggedIn.value = false }\n\n  return { name, isLoggedIn, login, logout }\n})\n\`\`\`\n\nComposition API 风格的 store，代码更灵活。\n\n## 持久化方案\n\n用 \`pinia-plugin-persistedstate\` 插件，一行配置搞定 localStorage 持久化。\n\n## 踩过的坑\n\n1. **SSR 中使用**：服务端渲染时 store 需要每个请求独立创建\n2. **热更新**：开发时修改 store 定义，需要正确配置 HMR\n3. **store 互相引用**：直接调用其他 store 的函数即可，不需要额外配置\n\n## 总结\n\nPinia 是 Vue 官方推荐的状态管理方案，如果你还在用 Vuex，真的建议迁移。API 更简洁，开发效率明显提升。`,
    'css-animation-tips': `## 背景\n\n做毕设的时候，首页有一堆动画效果——卡片渐入、数字滚动、进度条加载。在自己电脑上跑得很流畅，但在室友的老电脑上直接卡成 PPT。\n\n这才意识到 CSS 动画不只是写 \`transition\` 和 \`animation\`，性能也是一门学问。\n\n## 浏览器的渲染流程\n\n1. **JavaScript** → 触发样式变化\n2. **Style** → 计算最终样式\n3. **Layout** → 计算元素位置和大小\n4. **Paint** → 绘制像素\n5. **Composite** → 合成图层\n\n性能优化的核心：**让动画只触发 Composite，跳过 Layout 和 Paint。**\n\n## 哪些属性触发 Composite\n\n- \`transform\`（translate、scale、rotate）\n- \`opacity\`\n\n这两个属性由 GPU 直接处理，不会引起重排重绘。\n\n## 优化实践\n\n### 1. 用 transform 替代 top/left\n\n\`\`\`css\n/* 差：触发 Layout */\n.move { transition: left 0.3s; }\n.move:hover { left: 100px; }\n\n/* 好：只触发 Composite */\n.move { transition: transform 0.3s; }\n.move:hover { transform: translateX(100px); }\n\`\`\`\n\n### 2. will-change 提示浏览器\n\n\`\`\`css\n.card:hover {\n  will-change: transform;\n  transform: translateY(-4px);\n}\n\`\`\`\n\n### 3. 避免同时动画太多元素\n\n超过 10 个元素同时做复杂动画，低端设备就会吃力。\n\n## 总结\n\n动画性能优化的关键是理解浏览器渲染管线。记住：**能用 transform 和 opacity 解决的动画，就别碰其他属性。**`,
    'vite-config-guide': `## 为什么整理这份配置\n\n每次建新项目都要翻以前的 \`vite.config.ts\`，干脆整理一份常用配置清单，也方便其他同学参考。\n\n## 路径别名\n\n\`\`\`typescript\nimport { resolve } from 'path'\n\nexport default defineConfig({\n  resolve: {\n    alias: {\n      '@': resolve(__dirname, 'src')\n    }\n  }\n})\n\`\`\`\n\ntsconfig 也要同步配置，否则 IDE 会报错。\n\n## 开发服务器代理\n\n\`\`\`typescript\nserver: {\n  proxy: {\n    '/api': {\n      target: 'http://localhost:3000',\n      changeOrigin: true,\n      rewrite: path => path.replace(/^\\/api/, '')\n    }\n  }\n}\n\`\`\`\n\n前后端联调必备。\n\n## 环境变量\n\n\`\`\`\n# .env.development\nVITE_API_BASE=http://localhost:3000\n\n# .env.production\nVITE_API_BASE=https://api.example.com\n\`\`\`\n\n代码中用 \`import.meta.env.VITE_API_BASE\` 读取。\n\n## 构建优化\n\n\`\`\`typescript\nbuild: {\n  rollupOptions: {\n    output: {\n      manualChunks: {\n        vue: ['vue', 'vue-router', 'pinia'],\n        markdown: ['markdown-it', 'highlight.js']\n      }\n    }\n  },\n  chunkSizeWarningLimit: 1000\n}\n\`\`\`\n\n把大的依赖拆成独立 chunk，利用浏览器缓存。\n\n## 总结\n\nVite 的配置项不算多，但每个都挺实用。建议建一个自己的配置模板，以后新项目直接复制。`,
    'frontend-journey': `## 前言\n\n我是刘小满，中南民族大学计算机专业大四学生。从大二开始自学前端，到现在两年了。这篇文章回顾一下整个过程，也写给正在学前端的学弟学妹们参考。\n\n## 2023.09 — 入门\n\n大二上学期，第一门 Web 课让我知道了 HTML 和 CSS 的存在。课后自己找 MDN 文档看，写了人生第一个网页——一个丑到不忍直视的个人主页。\n\n但那种"写几行代码就能在浏览器里看到效果"的感觉，真的很上头。\n\n## 2024.03 — 入坑 Vue\n\n大二下学期开始学 Vue。刚接触组件化的时候概念很抽象——为什么要拆组件？后来做项目多了才理解：**组件就是乐高积木，拼起来比捏泥巴快多了。**\n\n第一个完整的 Vue 项目是一个待办事项应用，实现了增删改查、本地存储。功能简单，但写完那一刻特别有成就感。\n\n## 2024.09 — 升级 Vue 3\n\n大三上学期，决定从 Vue 2 切换到 Vue 3。Composition API 一开始很不习惯，总觉得写法不如 Options API 直观。\n\n转折点是我写了一个表单验证的 composable：\n\n\`\`\`typescript\nfunction useForm(rules) {\n  const errors = ref({})\n  function validate(field, value) { ... }\n  return { errors, validate }\n}\n\`\`\`\n\n突然发现逻辑复用变得这么自然，从此彻底接受了 Composition API。\n\n## 2025.03 — 工程化\n\n大三下学期开始关注工程化：TypeScript 类型系统、Pinia 状态管理、Vite 构建优化。不再是"能跑就行"，开始追求代码质量和开发体验。\n\n## 2025.09 — 秋招\n\n大四上学期全力准备秋招。刷题、写项目、整理博客。这个个人博客网站也是这段时间做的——用来展示作品和沉淀技术文章。\n\n## 给学弟学妹的建议\n\n1. **基础很重要**——JS 基础不牢，学框架会很痛苦\n2. **多写项目**——看一百遍文档不如自己动手做一个\n3. **别怕踩坑**——每个 bug 都是学习机会\n4. **写博客记录**——输出是最好的学习方式\n5. **坚持**——前端东西多，但不用急，一步一步来\n\n## 最后\n\n两年时间不长，但足以从零基础到能独立完成项目。前端这条路，越走越有意思。`
  }
  return contents[id] || '# 文章内容加载中...\n\n这是一篇示例文章的占位内容。'
}
</script>

<template>
  <div class="blog-post-page">
    <div class="container">
      <button class="back-btn" @click="router.push('/blog')">
        ← 返回文章列表
      </button>

      <div v-if="post" class="post-layout">
        <article class="post-content glass" ref="articleRef">
          <header class="post-header">
            <span class="tag">{{ post.category }}</span>
            <h1>{{ post.title }}</h1>
            <div class="post-meta">
              <span>{{ post.date }}</span>
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="mini-tag">{{ tag }}</span>
              </div>
            </div>
          </header>
          <div class="markdown-body" v-html="renderedContent"></div>
        </article>

        <aside v-if="tocItems.length" class="toc-sidebar glass">
          <h4 class="toc-title">目录</h4>
          <nav class="toc-list">
            <a
              v-for="item in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="toc-link"
              :class="{ active: activeHeading === item.id, 'toc-h3': item.level === 3 }"
            >{{ item.text }}</a>
          </nav>
        </aside>
      </div>

      <div v-else class="not-found">
        <h2>文章未找到</h2>
        <button class="btn btn-primary" @click="router.push('/blog')">返回博客</button>
      </div>

      <!-- 上下篇导航 -->
      <div v-if="post" class="post-nav">
        <router-link
          v-if="prevPost"
          :to="`/blog/${prevPost.id}`"
          class="nav-link glass"
        >
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">{{ prevPost.title }}</span>
        </router-link>
        <div v-else></div>

        <router-link
          v-if="nextPost"
          :to="`/blog/${nextPost.id}`"
          class="nav-link glass"
        >
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">{{ nextPost.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-post-page {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
  min-height: 100vh;
}

.post-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.post-layout .post-content {
  flex: 1;
  min-width: 0;
}

/* TOC 侧栏 */
.toc-sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 20px;
  position: sticky;
  top: calc(var(--nav-height) + 24px);
}

.toc-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-link {
  display: block;
  padding: 4px 8px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition: all var(--transition-fast);
  line-height: 1.5;
}

.toc-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.toc-link.active {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 600;
}

.toc-link.toc-h3 {
  padding-left: 20px;
}

@media (max-width: 1024px) {
  .post-layout {
    flex-direction: column;
  }

  .toc-sidebar {
    display: none;
  }
}

.back-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 15px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 24px;
  transition: color var(--transition-fast);
}

.back-btn:hover {
  color: var(--color-primary-hover);
}

.post-content {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.post-header h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 16px 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.post-tags {
  display: flex;
  gap: 6px;
}

.mini-tag {
  font-size: 12px;
  padding: 2px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 10px;
}

.not-found {
  text-align: center;
  padding: 80px 0;
}

.not-found h2 {
  margin-bottom: 24px;
}

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  max-width: 800px;
  margin: 32px auto 0;
}

.nav-link {
  flex: 1;
  padding: 16px 20px;
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link:hover {
  transform: translateY(-2px);
}

.nav-label {
  font-size: 13px;
  color: var(--color-primary);
}

.nav-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
}

@media (max-width: 768px) {
  .post-content {
    padding: 24px;
  }

  .post-nav {
    flex-direction: column;
  }

  .post-header h1 {
    font-size: 24px;
  }
}
</style>
