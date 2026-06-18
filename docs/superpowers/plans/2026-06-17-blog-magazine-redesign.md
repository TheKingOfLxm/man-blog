# 博客「暖色杂志风」全面重构 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有「薄荷绿毛玻璃」博客全面重构为「暖色杂志风」，重做全部 6 个页面 + 新增标签页/搜索，补齐阅读时长等功能并修复 10 条既有缺陷。

**Architecture:** 保持现有 Vue 3 + TS + Vite + Pinia + vue-router 骨架与路由结构，重写设计系统（CSS 变量 + 字体）、替换/新增组件、重写各视图模板与样式、新增数据文件与可换题记。纯逻辑（阅读时长、搜索）抽成可独立验证的纯函数。

**Tech Stack:** Vue 3 (`<script setup>`)、TypeScript、Vite 8、Pinia 3、vue-router 4、markdown-it + highlight.js、原生 CSS（CSS 变量驱动主题）。

**Verification note:** 项目无测试运行器（spec 的 YAGNI 明确不加）。每个任务的验证 = `npm run build`（含 `vue-tsc` 类型检查）通过 + `npm run dev` 手动目测。纯函数用 compute 脚本 / 手动触发验证。命令默认在 `blog/` 目录下执行。

**Spec:** `docs/superpowers/specs/2026-06-17-blog-magazine-redesign.md`

---

## 文件结构（Create / Modify / Delete）

**Create:**
- `blog/src/data/site.json` — 站点元信息 + 可换卷首题记
- `blog/scripts/compute-post-meta.mjs` — 计算阅读时长/字数并回写 posts.json
- `blog/src/assets/styles/code-theme.css` — 自定 hljs 暖色高亮（亮/暗）
- `blog/src/composables/useSearch.ts` — 按 标题/摘要/标签 过滤
- `blog/src/composables/useReadingTime.ts` — 详情页兜底阅读时长
- `blog/src/components/Masthead.vue` — 首页大刊头
- `blog/src/components/Epigraph.vue` — 卷首题记（读 site.json）
- `blog/src/components/FeaturedPost.vue` — 首页精选文章
- `blog/src/components/PostCard.vue` — 编辑感文章卡
- `blog/src/components/ProjectCard.vue` — 暖色项目卡
- `blog/src/components/TagFilter.vue` — 标签筛选条
- `blog/src/components/SearchOverlay.vue` — 全站搜索浮层（⌘K）
- `blog/src/components/Toc.vue` — 目录（桌面侧栏 / 移动折叠）
- `blog/src/components/ReadingProgress.vue` — 阅读进度条
- `blog/src/views/TagsView.vue` — 标签索引页

**Modify:**
- `blog/index.html` — 加载 Google Fonts
- `blog/src/assets/styles/variables.css` — 重写为暖色调色板
- `blog/src/assets/styles/global.css` — 重写全局/工具类/markdown 样式
- `blog/src/main.ts` — 移除 hljs 官方主题、改引 code-theme.css；移除 v-glow 注册
- `blog/src/types/index.ts` — Post 增字段、新增 Site 类型
- `blog/src/data/posts.json` — 增 featured/readingTime/wordCount
- `blog/src/router/index.ts` — 新增 /tags 路由、meta 标题微调
- `blog/src/composables/useScrollReveal.ts` — 作用域限定 + refresh
- `blog/src/composables/useSeo.ts` — 支持 getter，修生命周期
- `blog/src/components/NavBar.vue`、`ThemeToggle.vue`、`BackToTop.vue` — 暖色重做
- `blog/src/views/*.vue` — 全部重写

**Delete:**
- `blog/src/composables/useCardGlow.ts`（杂志风去光晕）
- `blog/src/composables/useTypewriter.ts`（首页不再用打字机）

> 顺序保证：删除 `v-glow`/`useTypewriter` 放在最后清理任务，期间 `main.ts` 仍注册 `v-glow`（无害），所有视图重写后自然不再使用。

---

## Task 1: 设计系统地基（变量 + 全局 + 字体）

**Files:**
- Modify: `blog/src/assets/styles/variables.css`
- Modify: `blog/src/assets/styles/global.css`
- Modify: `blog/index.html`

- [ ] **Step 1: 重写 `variables.css` 为暖色调色板**

完整替换 `blog/src/assets/styles/variables.css`：

```css
:root {
  /* 亮色 · 暖色杂志 */
  --bg-page: #faf6ef;
  --bg-surface: #fffdf8;
  --bg-surface-alt: #f3ece0;

  --ink: #1c1917;
  --text-body: #57534e;
  --text-muted: #8c857c;
  --text-faint: #a8a096;

  --accent: #c2410c;
  --accent-hover: #9a3412;
  --accent-soft: rgba(194, 65, 12, 0.10);

  --rule: #1c1917;
  --border: #e7ddcd;
  --border-soft: #efe7d8;

  --shadow: 0 1px 3px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(28, 25, 23, 0.06);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --font-display: 'Fraunces', 'Noto Serif SC', Georgia, 'Times New Roman', serif;
  --font-sans: 'Inter', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
  --font-serif-cn: 'Noto Serif SC', 'Fraunces', serif;

  --transition-fast: 0.18s ease;
  --transition-normal: 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  --max-width: 1120px;
  --reading-width: 720px;
  --nav-height: 60px;
}

[data-theme='dark'] {
  --bg-page: #1a1714;
  --bg-surface: #241f1a;
  --bg-surface-alt: #2c2620;

  --ink: #f5efe4;
  --text-body: #c9bfb0;
  --text-muted: #9b9082;
  --text-faint: #7c7264;

  --accent: #fb923c;
  --accent-hover: #fdba74;
  --accent-soft: rgba(251, 146, 60, 0.12);

  --rule: #f5efe4;
  --border: #3a322a;
  --border-soft: #2e2822;

  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.35);
}
```

- [ ] **Step 2: 重写 `global.css`**

完整替换 `blog/src/assets/styles/global.css`：

```css
@import './variables.css';

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-page);
  color: var(--text-body);
  min-height: 100vh;
  transition: background var(--transition-normal), color var(--transition-normal);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--accent-hover);
}

h1, h2, h3, h4 {
  color: var(--ink);
  font-family: var(--font-display);
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.01em;
}

img {
  max-width: 100%;
  display: block;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 32px;
}

/* 分节标签：01 — 标题 */
.section-label {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 56px 0 28px;
}
.section-label .num {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  font-weight: 700;
}
.section-label h2 {
  font-size: 20px;
}
.section-label .more {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-muted);
  font-family: var(--font-sans);
}
.section-label .more:hover {
  color: var(--accent);
}

/* 按钮 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-primary {
  background: var(--accent);
  color: #fffdf8;
}
.btn-primary:hover {
  background: var(--accent-hover);
  color: #fffdf8;
}
.btn-outline {
  background: transparent;
  color: var(--accent);
}
.btn-outline:hover {
  background: var(--accent);
  color: #fffdf8;
}
.btn-sm {
  padding: 7px 14px;
  font-size: 12.5px;
}

/* 分类小标 / kicker */
.kicker {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
}

/* 标签 chip（杂志直角微圆） */
.tag {
  display: inline-block;
  padding: 2px 9px;
  font-size: 11.5px;
  font-family: var(--font-sans);
  color: var(--text-muted);
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-weight: 500;
}

/* 滚动渐入（克制） */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 页面过渡 */
.page-enter-active {
  transition: opacity 0.3s ease;
}
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 骨架屏 */
.skeleton {
  background: linear-gradient(90deg, var(--bg-surface-alt) 25%, var(--border) 37%, var(--bg-surface-alt) 63%);
  background-size: 400% 100%;
  animation: skeleton-pulse 1.4s ease infinite;
  border-radius: var(--radius-sm);
}
@keyframes skeleton-pulse {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* 焦点 */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
:focus:not(:focus-visible) {
  outline: none;
}

/* 降级动画 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 3: 在 `index.html` 加载字体**

修改 `blog/index.html`，把 `<head>` 里两行 `preconnect` 之后、`</head>` 之前加入字体 `<link>`：

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;700&display=swap" rel="stylesheet" />
```

（删除原有的两条 preconnect 之外的内容不变；若已存在两条 preconnect，保留并在其后插入 link。）

- [ ] **Step 4: 验证 build 通过**

Run: `cd blog && npm run build`
Expected: 类型检查 + 构建成功（此时页面仍是旧结构套新底色，属正常）。

- [ ] **Step 5: Commit**

```bash
git add blog/src/assets/styles/variables.css blog/src/assets/styles/global.css blog/index.html
git commit -m "feat: 重写设计系统为暖色杂志风（变量/全局/字体）"
```

---

## Task 2: 自定代码高亮主题（修暗色 bug）

**Files:**
- Create: `blog/src/assets/styles/code-theme.css`
- Modify: `blog/src/main.ts`

- [ ] **Step 1: 新建 `code-theme.css`**

```css
/* 自定暖色 hljs 主题：CSS 变量驱动亮/暗，与全站统一。
   取代 highlight.js 官方 atom-one-light/dark（全局无法切换主题）。 */
:root {
  --code-bg: #f7f1e6;
  --code-text: #3f3a32;
  --c-keyword: #b45309;
  --c-string: #15803d;
  --c-number: #9a3412;
  --c-literal: #9a3412;
  --c-comment: #a8a096;
  --c-title: #7c2d12;
  --c-function: #1c1917;
  --c-attr: #92400e;
  --c-built_in: #047857;
  --c-tag: #b45309;
  --c-meta: #a8a096;
}
[data-theme='dark'] {
  --code-bg: #211c17;
  --code-text: #d6cdbf;
  --c-keyword: #fbbf24;
  --c-string: #86efac;
  --c-number: #fdba74;
  --c-literal: #fdba74;
  --c-comment: #7c7264;
  --c-title: #fed7aa;
  --c-function: #f5efe4;
  --c-attr: #fcd34d;
  --c-built_in: #6ee7b7;
  --c-tag: #fbbf24;
  --c-meta: #7c7264;
}

.hljs {
  color: var(--code-text);
  background: transparent;
}
.hljs-comment, .hljs-quote { color: var(--c-comment); font-style: italic; }
.hljs-keyword, .hljs-selector-tag, .hljs-type { color: var(--c-keyword); }
.hljs-string, .hljs-regexp, .hljs-addition { color: var(--c-string); }
.hljs-number, .hljs-literal, .hljs-symbol, .hljs-bullet { color: var(--c-literal); }
.hljs-title, .hljs-title.function_, .hljs-section { color: var(--c-title); }
.hljs-function .hljs-title { color: var(--c-function); }
.hljs-attr, .hljs-attribute, .hljs-variable, .hljs-template-variable { color: var(--c-attr); }
.hljs-built_in, .hljs-class .hljs-title, .hljs-name { color: var(--c-built_in); }
.hljs-tag { color: var(--c-tag); }
.hljs-meta { color: var(--c-meta); }
.hljs-deletion { color: var(--c-literal); }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: 700; }
```

- [ ] **Step 2: 改 `main.ts`：移除官方主题，引入 code-theme**

把 `blog/src/main.ts` 中：
```ts
import 'highlight.js/styles/atom-one-light.css'
import './assets/styles/global.css'
```
替换为：
```ts
import './assets/styles/code-theme.css'
import './assets/styles/global.css'
```

（`v-glow` 的 import/注册暂保留，清理任务统一移除。）

- [ ] **Step 3: 验证 build**

Run: `cd blog && npm run build`
Expected: 成功，无类型错误。

- [ ] **Step 4: Commit**

```bash
git add blog/src/assets/styles/code-theme.css blog/src/main.ts
git commit -m "feat: 自定暖色代码高亮主题，修复暗色模式不高亮"
```

---

## Task 3: 数据与类型（site.json + 阅读时长 + featured）

**Files:**
- Modify: `blog/src/types/index.ts`
- Create: `blog/src/data/site.json`
- Create: `blog/scripts/compute-post-meta.mjs`
- Modify: `blog/src/data/posts.json`

- [ ] **Step 1: 更新 `types/index.ts`**

完整替换 `blog/src/types/index.ts`：

```ts
export interface Post {
  id: string
  title: string
  summary: string
  content: string
  category: string
  date: string
  tags: string[]
  featured?: boolean
  readingTime?: number
  wordCount?: number
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demo?: string
  source?: string
}

export interface Epigraph {
  label: string
  stanzas: string[]
  attribution: string
}

export interface Site {
  name: string
  kicker: string
  volume: string
  topics: string[]
  author: string
  epigraph: Epigraph
  social: {
    github: string
    email: string
  }
}
```

- [ ] **Step 2: 新建 `site.json`**

`blog/src/data/site.json`：

```json
{
  "name": "刘小满的技术随笔",
  "kicker": "Frontend · 技术随笔",
  "volume": "Vol. 01 · 2026",
  "topics": ["Vue 3", "CSS", "工程化", "随笔"],
  "author": "刘小满",
  "epigraph": {
    "label": "卷首 · 题记",
    "stanzas": [
      "白鸥问我泊孤舟，是身留，是心留？心若留时，何事锁眉头？风拍小帘灯晕舞，对闲影，冷清清，忆旧游。",
      "旧游旧游今在否？花外楼，柳下舟。梦也梦也，梦不到，寒水空流。漠漠黄云，湿透木棉裘。都道无人愁似我，今夜雪，有梅花，似我愁。"
    ],
    "attribution": "—— 蒋捷《梅花引 · 荆溪阻雪》"
  },
  "social": {
    "github": "https://github.com/TheKingOfLxm",
    "email": "2083272571@qq.com"
  }
}
```

- [ ] **Step 3: 新建阅读时长计算脚本**

`blog/scripts/compute-post-meta.mjs`：

```js
// 计算每篇文章阅读时长/字数，回写 src/data/posts.json。
// 用法：在 blog/ 目录执行  node scripts/compute-post-meta.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const postsPath = path.join(root, 'src', 'data', 'posts.json');
const postsDir = path.join(root, 'public', 'posts');

const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

for (const post of posts) {
  const mdPath = path.join(postsDir, `${post.id}.md`);
  const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  // 去代码块与行内代码
  const noCode = md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  // 去 markdown 语法
  const text = noCode
    .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, ' ')
    .replace(/\[([^\]]*)\]\([\s\S]*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_~\-|]/g, ' ');
  const cjk = (text.match(/[一-龥]/g) || []).length;
  const latinWords = (text.match(/[A-Za-z]+/g) || []).length;
  post.wordCount = cjk + latinWords;
  post.readingTime = Math.max(1, Math.ceil(cjk / 400 + latinWords / 200));
}

fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2) + '\n');
console.log('已更新阅读时长：');
for (const p of posts) console.log(`  ${p.id}: ${p.readingTime} 分钟 / ${p.wordCount} 字`);
```

- [ ] **Step 4: 运行脚本回写 posts.json**

Run: `cd blog && node scripts/compute-post-meta.mjs`
Expected: 打印每篇的阅读时长/字数，posts.json 新增 `readingTime`/`wordCount` 字段。

- [ ] **Step 5: 给精选文章标 featured**

编辑 `blog/src/data/posts.json`，给 `id` 为 `vue3-reactive-principle` 的对象增加一行 `"featured": true,`（与同级字段对齐缩进）。其余文章不加。

- [ ] **Step 6: 验证 build + 数据**

Run: `cd blog && npm run build`
Expected: 成功。可手动 `cat blog/src/data/posts.json` 确认 featured/readingTime/wordCount 已写入。

- [ ] **Step 7: Commit**

```bash
git add blog/src/types/index.ts blog/src/data/site.json blog/scripts/compute-post-meta.mjs blog/src/data/posts.json
git commit -m "feat: 新增 site.json/可换题记、阅读时长计算脚本与 featured 字段"
```

---

## Task 4: Composables（scrollReveal / seo / search / readingTime）

**Files:**
- Modify: `blog/src/composables/useScrollReveal.ts`
- Modify: `blog/src/composables/useSeo.ts`
- Create: `blog/src/composables/useSearch.ts`
- Create: `blog/src/composables/useReadingTime.ts`

- [ ] **Step 1: 重写 `useScrollReveal.ts`（作用域限定 + refresh）**

完整替换：

```ts
import { onMounted, onUnmounted } from 'vue'

/**
 * 在组件根元素内观察 .reveal 元素，进入视口加 .visible。
 * 通过 refresh() 重新观察新增的 .reveal（如筛选后重渲染）。
 */
export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
  }

  function observeAll() {
    if (!observer) return
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      observer!.observe(el)
    })
  }

  onMounted(() => {
    setupObserver()
    observeAll()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { refresh: observeAll }
}
```

- [ ] **Step 2: 重写 `useSeo.ts`（支持 getter，修生命周期）**

完整替换。要点：接受 `SeoOptions | (() => SeoOptions)`；在 setup 顶层调用一次；内部 watch getter 重新应用；onUnmounted 清理 JSON-LD。

```ts
import { watch, onUnmounted, unref } from 'vue'
import { useRoute } from 'vue-router'

export interface SeoOptions {
  title: string
  description: string
  image?: string
  type?: string
  jsonLd?: object
}

const SITE_URL = 'https://liuxiaoman.dev'
const DEFAULT_IMAGE = `${SITE_URL}/images/projects/blog.jpg`

function getOrCreateMeta(name: string, isProperty = false): HTMLMetaElement {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  return el
}

function updateMeta(name: string, content: string, isProperty = false) {
  getOrCreateMeta(name, isProperty).setAttribute('content', content)
}

let jsonLdEl: HTMLScriptElement | null = null

function setJsonLd(data: object) {
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script')
    jsonLdEl.type = 'application/ld+json'
    document.head.appendChild(jsonLdEl)
  }
  jsonLdEl.textContent = JSON.stringify(data)
}

function removeJsonLd() {
  if (jsonLdEl) {
    jsonLdEl.remove()
    jsonLdEl = null
  }
}

/**
 * 必须在 setup 顶层同步调用。
 * options 可为静态对象，或返回 SeoOptions 的 getter（用于异步数据，如文章详情）。
 */
export function useSeo(options: SeoOptions | (() => SeoOptions)) {
  const route = useRoute()
  const resolve = (): SeoOptions => (typeof options === 'function' ? options() : unref(options) as SeoOptions)

  function applySeo() {
    const o = resolve()
    document.title = o.title
    updateMeta('description', o.description)
    updateMeta('og:title', o.title, true)
    updateMeta('og:description', o.description, true)
    updateMeta('og:url', `${SITE_URL}${route.path}`, true)
    updateMeta('og:type', o.type || 'website', true)
    updateMeta('og:image', o.image || DEFAULT_IMAGE, true)
    updateMeta('twitter:card', 'summary_large_image')
    if (o.jsonLd) setJsonLd(o.jsonLd)
  }

  applySeo()

  if (typeof options === 'function') {
    watch(() => route.path, applySeo)
  } else {
    watch(() => route.path, applySeo)
  }

  onUnmounted(removeJsonLd)

  return { refresh: applySeo }
}
```

> 说明：BlogPostView 将在 setup 顶层调用 `useSeo(() => post.value ? {...} : default)`，并通过 `watch(post, refresh)` 在文章异步加载后刷新。详见 Task 10。

- [ ] **Step 3: 新建 `useSearch.ts`（纯函数 + 响应式封装）**

`blog/src/composables/useSearch.ts`：

```ts
import { computed, type Ref } from 'vue'
import type { Post } from '../types'

/** 纯函数：按 标题/摘要/标签 过滤文章（大小写不敏感）。 */
export function filterPosts(posts: Post[], query: string): Post[] {
  const q = query.trim().toLowerCase()
  if (!q) return posts
  return posts.filter((p) => {
    const hay = [p.title, p.summary, p.tags.join(' ')].join(' ').toLowerCase()
    return hay.includes(q)
  })
}

/** 响应式封装：输入 posts 与 query(Ref<string>)，返回过滤结果。 */
export function useSearch(posts: Post[], query: Ref<string>) {
  return computed(() => filterPosts(posts, query.value))
}
```

- [ ] **Step 4: 新建 `useReadingTime.ts`（详情页兜底）**

`blog/src/composables/useReadingTime.ts`：

```ts
/** 从 markdown 原文估算阅读时长/字数（兜底用；列表页直接读 post.readingTime）。 */
export function estimateReadingTime(md: string): { readingTime: number; wordCount: number } {
  const noCode = md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
  const text = noCode
    .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, ' ')
    .replace(/\[([^\]]*)\]\([\s\S]*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_~\-|]/g, ' ')
  const cjk = (text.match(/[一-龥]/g) || []).length
  const latinWords = (text.match(/[A-Za-z]+/g) || []).length
  const wordCount = cjk + latinWords
  return {
    wordCount,
    readingTime: Math.max(1, Math.ceil(cjk / 400 + latinWords / 200)),
  }
}
```

- [ ] **Step 5: 验证 build**

Run: `cd blog && npm run build`
Expected: 成功（旧调用点 BlogPostView 的 `useSeo({...})` 仍兼容静态对象签名）。

- [ ] **Step 6: Commit**

```bash
git add blog/src/composables/useScrollReveal.ts blog/src/composables/useSeo.ts blog/src/composables/useSearch.ts blog/src/composables/useReadingTime.ts
git commit -m "feat: 重构 composables（scrollReveal 作用域/seo 生命周期/新增 search 与 readingTime）"
```

---

## Task 5: 路由 + meta（新增 /tags）

**Files:**
- Modify: `blog/src/router/index.ts`

- [ ] **Step 1: 增加 /tags 路由**

在 `blog/src/router/index.ts` 的 routes 数组中，`projects` 路由之后、`about` 之前插入：

```ts
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/TagsView.vue'),
      meta: { title: '标签索引 - 小满的博客' }
    },
```

并把 home 的 meta title 改为 `'小满的技术随笔 - 前端开发者'`，blog 改为 `'文章 - 小满的技术随笔'`，blog-post 改为 `'文章 - 小满的技术随笔'`，projects 改为 `'作品 - 小满的技术随笔'`，about 改为 `'关于 - 小满的技术随笔'`，tags 用上面新增的标题。`document.title` 兜底字符串改为 `'小满的技术随笔'`。

- [ ] **Step 2: 验证 build**

Run: `cd blog && npm run build`
Expected: 成功（TagsView 尚未创建，路由懒加载不会在构建期失败，但开发期访问 /tags 会 404 组件——Task 12 创建后即可）。

> 注：若 vue-tsc 对未存在文件报错，可暂时注释该路由，待 Task 12 创建 TagsView 后恢复。更稳妥：**先执行 Task 12 的 Step 1 创建空 TagsView 再回到本任务**。为避免阻塞，本计划假定 Tasks 按序执行，TagsView 在 Task 12 创建——构建期 Vite 不会因动态 import 不存在文件而失败（懒加载在运行期解析），故此步可过。

- [ ] **Step 3: Commit**

```bash
git add blog/src/router/index.ts
git commit -m "feat: 路由新增 /tags 标签索引页并统一 meta 标题"
```

---

## Task 6: 全局组件 NavBar / ThemeToggle / BackToTop 暖色重做

**Files:**
- Modify: `blog/src/components/NavBar.vue`
- Modify: `blog/src/components/ThemeToggle.vue`
- Modify: `blog/src/components/BackToTop.vue`

- [ ] **Step 1: 重写 `NavBar.vue`**

完整替换 `blog/src/components/NavBar.vue`：

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const emit = defineEmits<{ (e: 'search'): void }>()

const scrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '文章' },
  { path: '/projects', label: '作品' },
  { path: '/about', label: '关于' }
]

function handleScroll() {
  scrolled.value = window.scrollY > 16
}
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav class="navbar" :class="{ scrolled }" aria-label="主导航">
    <div class="navbar-inner container">
      <RouterLink to="/" class="logo">
        <span class="logo-mark">◆</span>
        <span class="logo-text">小满的技术随笔</span>
      </RouterLink>

      <div class="nav-right">
        <div class="nav-links" role="menubar">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            :class="{ active: route.path === link.path || (link.path !== '/' && route.path.startsWith(link.path)) }"
            role="menuitem"
            @click="menuOpen = false"
          >{{ link.label }}</RouterLink>
        </div>
        <button class="icon-btn search-btn" @click="emit('search')" aria-label="搜索文章">⌕</button>
        <ThemeToggle />
      </div>

      <button class="hamburger" @click="toggleMenu" :class="{ active: menuOpen }" aria-label="切换菜单" :aria-expanded="menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu" v-if="menuOpen" role="menu">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="mobile-link"
        role="menuitem"
        @click="menuOpen = false"
      >{{ link.label }}</RouterLink>
      <button class="mobile-link mobile-search" @click="emit('search'); menuOpen = false">⌕ 搜索文章</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--nav-height);
  transition: background var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: color-mix(in srgb, var(--bg-page) 82%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom-color: var(--border);
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.logo-mark {
  color: var(--accent);
  font-size: 15px;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.nav-links {
  display: flex;
  gap: 4px;
}
.nav-link {
  padding: 7px 14px;
  font-family: var(--font-sans);
  color: var(--text-body);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.nav-link:hover {
  color: var(--accent);
}
.nav-link.active {
  color: var(--ink);
  font-weight: 600;
}
.icon-btn {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-body);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.icon-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 20px; height: 2px;
  background: var(--ink);
  border-radius: 2px;
  transition: all var(--transition-fast);
}
.hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 10px 24px 18px;
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
}
.mobile-link {
  padding: 13px 0;
  color: var(--text-body);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid var(--border-soft);
  text-align: left;
  background: none;
  border-left: none; border-right: none; border-top: none;
  cursor: pointer;
  font-family: var(--font-sans);
}
@media (max-width: 768px) {
  .nav-right { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
}
</style>
```

- [ ] **Step 2: 重写 `ThemeToggle.vue`（保留 View Transition，换暖色）**

把 `<style scoped>` 里的 `.theme-toggle` 改为暖色（其余脚本与非 scoped 样式保留）：

```vue
<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--accent);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.theme-toggle:hover {
  background: var(--accent);
  color: #fffdf8;
  border-color: var(--accent);
  transform: none;
}
</style>
```

（`<script setup>` 与非 scoped 的 `::view-transition` 样式块保持不变。）

- [ ] **Step 3: 重写 `BackToTop.vue` 暖色**

把 `.back-to-top` 样式块替换为：

```css
.back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  color: var(--accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  transition: all var(--transition-fast);
  z-index: 90;
}
.back-to-top:hover {
  background: var(--accent);
  color: #fffdf8;
  border-color: var(--accent);
  transform: translateY(-3px);
}
```

（其余结构不变。）

- [ ] **Step 4: 在 `App.vue` 接收 search 事件（占位，SearchOverlay 在 Task 9）**

修改 `blog/src/App.vue`，加 state 控制浮层（Task 9 完成后接线）：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import BackToTop from './components/BackToTop.vue'
const searchOpen = ref(false)
</script>

<template>
  <NavBar @search="searchOpen = true" />
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <BackToTop />
</template>
```

> Task 9 会在模板里追加 `<SearchOverlay v-model:open="searchOpen" />`。

- [ ] **Step 5: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev`
Expected: 导航栏呈暖色细栏，滚动后出现底色+描边；主题按钮、回顶按钮暖色。搜索按钮暂无功能（Task 9 接线）。

- [ ] **Step 6: Commit**

```bash
git add blog/src/components/NavBar.vue blog/src/components/ThemeToggle.vue blog/src/components/BackToTop.vue blog/src/App.vue
git commit -m "feat: NavBar/ThemeToggle/BackToTop 暖色重做，导航加搜索入口"
```

---

## Task 7: 首页内容组件 Masthead / Epigraph / FeaturedPost

**Files:**
- Create: `blog/src/components/Masthead.vue`
- Create: `blog/src/components/Epigraph.vue`
- Create: `blog/src/components/FeaturedPost.vue`

- [ ] **Step 1: 新建 `Masthead.vue`**

```vue
<script setup lang="ts">
import site from '../data/site.json'
</script>

<template>
  <header class="masthead">
    <div class="kicker">{{ site.kicker }}</div>
    <h1 class="title">{{ site.name }}</h1>
    <div class="volume"><i></i>{{ site.volume }}<i></i></div>
  </header>
</template>

<style scoped>
.masthead {
  text-align: center;
  padding: 64px 0 26px;
  border-bottom: 2px solid var(--rule);
}
.kicker {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
}
.title {
  font-size: clamp(30px, 6vw, 48px);
  margin-top: 12px;
  color: var(--ink);
  line-height: 1;
}
.volume {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.volume i {
  display: inline-block;
  width: 32px;
  height: 1px;
  background: var(--text-muted);
}
</style>
```

- [ ] **Step 2: 新建 `Epigraph.vue`（读 site.json，可换）**

```vue
<script setup lang="ts">
import site from '../data/site.json'
</script>

<template>
  <section class="epigraph">
    <div class="label">{{ site.epigraph.label }}</div>
    <div class="poem">
      <p v-for="(s, i) in site.epigraph.stanzas" :key="i" class="stanza">{{ s }}</p>
    </div>
    <div class="attribution">{{ site.epigraph.attribution }}</div>
    <div class="topics">
      <span v-for="t in site.topics" :key="t">{{ t }}</span>
    </div>
  </section>
</template>

<style scoped>
.epigraph {
  text-align: center;
  padding: 34px 8px 30px;
  border-bottom: 1px solid var(--border);
}
.label {
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 20px;
}
.poem {
  font-family: var(--font-serif-cn);
  color: var(--text-body);
  font-size: clamp(14px, 2vw, 16px);
  line-height: 2.1;
  letter-spacing: 0.04em;
  max-width: 640px;
  margin: 0 auto;
}
.stanza {
  margin-bottom: 10px;
}
.stanza:last-child {
  margin-bottom: 0;
}
.attribution {
  font-family: var(--font-serif-cn);
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.06em;
  margin-top: 20px;
}
.topics {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 18px;
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  font-weight: 600;
}
.topics span {
  color: var(--accent);
}
</style>
```

- [ ] **Step 3: 新建 `FeaturedPost.vue`**

```vue
<script setup lang="ts">
import type { Post } from '../types'
defineProps<{ post: Post }>()
</script>

<template>
  <router-link :to="`/blog/${post.id}`" class="featured">
    <div class="feat-text">
      <span class="kicker">精选 · {{ post.category }}</span>
      <h2 class="feat-title">{{ post.title }}</h2>
      <p class="feat-dek">{{ post.summary }}</p>
      <div class="feat-meta">
        <span>{{ post.date }}</span>
        <span class="pill" v-if="post.readingTime">{{ post.readingTime }} 分钟阅读</span>
        <span class="tags">#{{ post.tags.join(' #') }}</span>
      </div>
      <span class="feat-cta">阅读全文 →</span>
    </div>
    <div class="feat-art" :aria-hidden="true">
      <span class="art-mark">{{ post.category }}.</span>
    </div>
  </router-link>
</template>

<style scoped>
.featured {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 36px;
  align-items: center;
  padding: 36px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
}
.feat-title {
  font-size: clamp(26px, 4vw, 36px);
  line-height: 1.1;
  margin: 12px 0 14px;
  color: var(--ink);
  transition: color var(--transition-fast);
}
.featured:hover .feat-title { color: var(--accent); }
.feat-dek {
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-body);
  max-width: 42ch;
}
.feat-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  font-size: 12px;
  color: var(--text-muted);
  flex-wrap: wrap;
}
.pill {
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
}
.tags { color: var(--accent); font-weight: 600; }
.feat-cta {
  display: inline-flex;
  margin-top: 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 3px;
}
.feat-art {
  height: 240px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--bg-surface-alt), var(--border));
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}
.feat-art::before {
  content: '{}';
  position: absolute;
  top: 16px; right: 20px;
  font-family: var(--font-mono);
  font-size: 64px;
  color: var(--accent-soft);
  font-weight: 700;
}
.art-mark {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 56px;
  color: var(--accent);
  opacity: 0.85;
  line-height: 0.9;
}
@media (max-width: 768px) {
  .featured { grid-template-columns: 1fr; gap: 22px; }
  .feat-art { height: 180px; order: -1; }
}
</style>
```

- [ ] **Step 4: 验证 build**

Run: `cd blog && npm run build`
Expected: 成功（组件尚未被引用，但类型/语法需正确）。

- [ ] **Step 5: Commit**

```bash
git add blog/src/components/Masthead.vue blog/src/components/Epigraph.vue blog/src/components/FeaturedPost.vue
git commit -m "feat: 新增 Masthead/Epigraph/FeaturedPost 首页组件"
```

---

## Task 8: PostCard / ProjectCard / TagFilter 通用组件

**Files:**
- Create: `blog/src/components/PostCard.vue`
- Create: `blog/src/components/ProjectCard.vue`
- Create: `blog/src/components/TagFilter.vue`

- [ ] **Step 1: 新建 `PostCard.vue`**

```vue
<script setup lang="ts">
import type { Post } from '../types'
defineProps<{ post: Post }>()
</script>

<template>
  <router-link :to="`/blog/${post.id}`" class="post-card reveal">
    <span class="kicker">{{ post.category }}</span>
    <h3 class="post-title">{{ post.title }}</h3>
    <p class="post-summary">{{ post.summary }}</p>
    <div class="post-meta">
      <span>{{ post.date }}</span>
      <span class="dot"></span>
      <span v-if="post.readingTime">{{ post.readingTime }} 分钟</span>
    </div>
  </router-link>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
  border-top: 1px solid var(--rule);
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-fast);
}
.post-card:hover { transform: translateY(-2px); }
.post-title {
  font-size: 18px;
  margin: 10px 0 8px;
  color: var(--ink);
  line-height: 1.3;
  transition: color var(--transition-fast);
}
.post-card:hover .post-title { color: var(--accent); }
.post-summary {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-muted);
  flex: 1;
  margin-bottom: 14px;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-faint);
}
.dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--text-faint);
}
</style>
```

- [ ] **Step 2: 新建 `ProjectCard.vue`**

```vue
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
```

- [ ] **Step 3: 新建 `TagFilter.vue`**

```vue
<script setup lang="ts">
defineProps<{
  tags: string[]
  modelValue: string
}>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="tag-filter" role="group" aria-label="按标签筛选">
    <button
      class="chip"
      :class="{ active: !modelValue }"
      @click="$emit('update:modelValue', '')"
    >全部标签</button>
    <button
      v-for="t in tags"
      :key="t"
      class="chip"
      :class="{ active: modelValue === t }"
      @click="$emit('update:modelValue', modelValue === t ? '' : t)"
    >{{ t }}</button>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  padding: 5px 12px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--text-body);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.chip:hover { color: var(--accent); border-color: var(--accent); }
.chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fffdf8;
}
</style>
```

- [ ] **Step 4: 验证 build**

Run: `cd blog && npm run build`
Expected: 成功。

- [ ] **Step 5: Commit**

```bash
git add blog/src/components/PostCard.vue blog/src/components/ProjectCard.vue blog/src/components/TagFilter.vue
git commit -m "feat: 新增 PostCard/ProjectCard/TagFilter 通用组件"
```

---

## Task 9: SearchOverlay 搜索浮层（⌘K）

**Files:**
- Create: `blog/src/components/SearchOverlay.vue`
- Modify: `blog/src/App.vue`

- [ ] **Step 1: 新建 `SearchOverlay.vue`**

```vue
<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import postsData from '../data/posts.json'
import { filterPosts } from '../composables/useSearch'
import type { Post } from '../types'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const router = useRouter()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const posts = postsData as Post[]

const results = computed(() => filterPosts(posts, query.value).slice(0, 8))

watch(() => props.open, (v) => {
  if (v) {
    query.value = ''
    nextTick(() => inputRef.value?.focus())
  }
})

function close() { emit('update:open', false) }
function go(id: string) {
  close()
  router.push(`/blog/${id}`)
}
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    emit('update:open', !props.open)
  } else if (e.key === 'Escape' && props.open) {
    close()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Transition name="overlay">
    <div v-if="open" class="overlay" @click.self="close">
      <div class="panel" role="dialog" aria-label="搜索文章">
        <div class="search-head">
          <span class="icon">⌕</span>
          <input
            ref="inputRef"
            v-model="query"
            class="search-input"
            type="text"
            placeholder="搜索文章标题、摘要或标签…"
            aria-label="搜索"
          />
          <kbd>ESC</kbd>
        </div>
        <ul class="result-list">
          <li v-if="results.length === 0" class="empty">没有匹配的文章</li>
          <li v-for="r in results" :key="r.id">
            <button class="result" @click="go(r.id)">
              <span class="r-cat kicker">{{ r.category }}</span>
              <span class="r-title">{{ r.title }}</span>
              <span class="r-meta" v-if="r.readingTime">{{ r.readingTime }} 分钟</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(28, 25, 23, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
}
.panel {
  width: min(620px, 92vw);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.search-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);
}
.icon { color: var(--text-muted); font-size: 18px; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--ink);
}
kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
}
.result-list { list-style: none; max-height: 50vh; overflow-y: auto; }
.empty { padding: 28px 20px; color: var(--text-muted); font-size: 14px; text-align: center; }
.result {
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}
.result:hover { background: var(--bg-surface-alt); }
.r-title { flex: 1; color: var(--ink); font-size: 14.5px; font-weight: 500; }
.r-cat { flex-shrink: 0; }
.r-meta { font-size: 11.5px; color: var(--text-faint); }
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-active .panel, .overlay-leave-active .panel { transition: transform 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
.overlay-enter-from .panel, .overlay-leave-to .panel { transform: translateY(-12px); }
</style>
```

- [ ] **Step 2: 在 `App.vue` 接线 SearchOverlay**

把 `blog/src/App.vue` 模板与脚本改为：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import BackToTop from './components/BackToTop.vue'
import SearchOverlay from './components/SearchOverlay.vue'

const searchOpen = ref(false)
</script>

<template>
  <NavBar @search="searchOpen = true" />
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <BackToTop />
  <SearchOverlay v-model:open="searchOpen" />
</template>
```

- [ ] **Step 3: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev`
Expected: 点导航放大镜或按 Ctrl/⌘+K 唤起搜索浮层；输入关键词按 标题/摘要/标签 过滤；点结果跳转；ESC 关闭。

- [ ] **Step 4: Commit**

```bash
git add blog/src/components/SearchOverlay.vue blog/src/App.vue
git commit -m "feat: 新增全站搜索浮层 SearchOverlay（⌘K，按标题/摘要/标签）"
```

---

## Task 10: 首页 HomeView 重写

**Files:**
- Modify: `blog/src/views/HomeView.vue`

- [ ] **Step 1: 重写 `HomeView.vue`**

完整替换：

```vue
<script setup lang="ts">
import { computed } from 'vue'
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

useScrollReveal()

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
  <div class="home container">
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
```

- [ ] **Step 2: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev`
Expected: 首页呈现 刊头 → 卷首题记 → 精选文章 → 01 最新文章(3) → 02 精选作品(2)。无打字机、无 emoji 头像、无虚荣数字。

- [ ] **Step 3: Commit**

```bash
git add blog/src/views/HomeView.vue
git commit -m "feat: 首页重写为杂志封面（刊头/卷首题记/精选/最新/作品）"
```

---

## Task 11: 博客列表 BlogView 重写（分类+标签+搜索查询）

**Files:**
- Modify: `blog/src/views/BlogView.vue`

- [ ] **Step 1: 重写 `BlogView.vue`**

完整替换。要点：分类 tabs + 标签筛选 + URL 查询回填；显示用 computed 过滤。

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import postsData from '../data/posts.json'
import PostCard from '../components/PostCard.vue'
import TagFilter from '../components/TagFilter.vue'
import type { Post } from '../types'

const route = useRoute()
const router = useRouter()
const posts = postsData as Post[]

const categories = ['全部', ...Array.from(new Set(posts.map(p => p.category)))]
const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort()

const selectedCategory = ref<string>((route.query.cat as string) || '全部')
const selectedTag = ref<string>((route.query.tag as string) || '')

const filtered = computed(() => {
  return posts.filter((p) => {
    const catOk = selectedCategory.value === '全部' || p.category === selectedCategory.value
    const tagOk = !selectedTag.value || p.tags.includes(selectedTag.value)
    return catOk && tagOk
  })
})

// 查询参数双向同步
watch([selectedCategory, selectedTag], ([cat, tag]) => {
  const query: Record<string, string> = {}
  if (cat && cat !== '全部') query.cat = cat
  if (tag) query.tag = tag
  router.replace({ query })
})

const { refresh } = useScrollReveal()
watch(filtered, () => { refresh() })

useSeo({
  title: '文章 - 小满的技术随笔',
  description: '记录 Vue、CSS、工程化等前端实践里的思考与避坑。',
  type: 'website'
})
</script>

<template>
  <div class="blog container">
    <header class="page-head reveal">
      <span class="kicker">Archive</span>
      <h1>文章</h1>
      <p class="subtitle">记录学习路上的思考与实践</p>
    </header>

    <div class="filters reveal">
      <div class="cat-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >{{ cat }}</button>
      </div>
      <TagFilter v-model="selectedTag" :tags="allTags" />
    </div>

    <div class="posts-grid" v-if="filtered.length">
      <PostCard v-for="post in filtered" :key="post.id" :post="post" />
    </div>
    <div v-else class="empty reveal" role="status">
      <p>没有找到匹配的文章</p>
      <button class="btn btn-outline btn-sm" @click="selectedCategory = '全部'; selectedTag = ''">清除筛选</button>
    </div>
  </div>
</template>

<style scoped>
.blog {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head {
  text-align: center;
  margin-bottom: 36px;
}
.page-head h1 {
  font-size: clamp(28px, 5vw, 40px);
  margin: 10px 0 6px;
}
.subtitle { color: var(--text-muted); font-size: 15px; }
.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--rule);
}
.cat-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn {
  padding: 7px 16px;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--text-body);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.cat-btn:hover { color: var(--accent); border-color: var(--accent); }
.cat-btn.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--bg-page);
}
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 28px;
  padding-top: 20px;
}
.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
@media (max-width: 640px) {
  .posts-grid { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 2: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev`
Expected: 分类与标签可叠加筛选，URL `?cat=&tag=` 随之更新并可回填；无结果时显示空态 + 清除按钮。

- [ ] **Step 3: Commit**

```bash
git add blog/src/views/BlogView.vue
git commit -m "feat: 博客列表重写（分类+标签筛选+URL 查询+空态）"
```

---

## Task 12: 标签索引页 TagsView

**Files:**
- Create: `blog/src/views/TagsView.vue`

- [ ] **Step 1: 新建 `TagsView.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import postsData from '../data/posts.json'
import type { Post } from '../types'

const posts = postsData as Post[]

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts) map.set(p.category, (map.get(p.category) || 0) + 1)
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
})

const tags = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts) for (const t of p.tags) map.set(t, (map.get(t) || 0) + 1)
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
})

// 按数量映射字号
function size(count: number, max: number) {
  const min = 13, top = 26
  return Math.round(min + (top - min) * (count / max))
}

useScrollReveal()
useSeo({
  title: '标签索引 - 小满的技术随笔',
  description: '按分类与标签浏览全部文章。'
})
</script>

<template>
  <div class="tags container">
    <header class="page-head reveal">
      <span class="kicker">Index</span>
      <h1>标签索引</h1>
      <p class="subtitle">按分类与标签浏览全部文章</p>
    </header>

    <section class="block reveal">
      <h2 class="block-title">分类</h2>
      <div class="cloud">
        <router-link
          v-for="[cat, n] in categories"
          :key="cat"
          :to="{ path: '/blog', query: { cat } }"
          class="cat-chip"
        >{{ cat }} <span class="n">{{ n }}</span></router-link>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">标签</h2>
      <div class="cloud">
        <router-link
          v-for="[tag, n] in tags"
          :key="tag"
          :to="{ path: '/blog', query: { tag } }"
          class="tag-chip"
          :style="{ fontSize: size(n, tags[0][1]) + 'px' }"
        >{{ tag }} <span class="n">{{ n }}</span></router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tags {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head { text-align: center; margin-bottom: 44px; }
.page-head h1 { font-size: clamp(28px, 5vw, 40px); margin: 10px 0 6px; }
.subtitle { color: var(--text-muted); font-size: 15px; }
.block { margin-bottom: 48px; }
.block-title {
  font-size: 16px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.cloud { display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: baseline; }
.cat-chip {
  padding: 6px 14px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-body);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.cat-chip:hover { color: var(--accent); border-color: var(--accent); }
.tag-chip {
  font-family: var(--font-sans);
  line-height: 1;
  color: var(--text-body);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.tag-chip:hover { color: var(--accent); }
.n { color: var(--text-faint); font-size: 0.7em; margin-left: 3px; }
</style>
```

- [ ] **Step 2: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev` 访问 `/tags`
Expected: 分类与标签云按数量成大小，点击跳到 `/blog?cat=` 或 `?tag=`。

- [ ] **Step 3: Commit**

```bash
git add blog/src/views/TagsView.vue
git commit -m "feat: 新增 /tags 标签索引页（分类+标签云）"
```

---

## Task 13: Toc / ReadingProgress 组件

**Files:**
- Create: `blog/src/components/Toc.vue`
- Create: `blog/src/components/ReadingProgress.vue`

- [ ] **Step 1: 新建 `ReadingProgress.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const progress = ref(0)
function onScroll() {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  progress.value = total > 0 ? (h.scrollTop / total) * 100 : 0
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="reading-progress" :style="{ transform: `scaleX(${progress / 100})` }" aria-hidden="true"></div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 2px;
  transform-origin: left;
  background: var(--accent);
  z-index: 110;
}
</style>
```

- [ ] **Step 2: 新建 `Toc.vue`（桌面侧栏 + 移动折叠）**

```vue
<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  items: { id: string; text: string; level: number }[]
  activeId: string
}>()
const open = ref(false)
function jump(e: Event, id: string) {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
  open.value = false
}
</script>

<template>
  <!-- 移动端折叠 -->
  <details class="toc-mobile">
    <summary>目录</summary>
    <nav class="toc-list" aria-label="文章目录">
      <a
        v-for="item in items"
        :key="item.id"
        href="#"
        class="toc-link"
        :class="{ active: activeId === item.id, 'h3': item.level === 3 }"
        @click="(e) => jump(e, item.id)"
      >{{ item.text }}</a>
    </nav>
  </details>

  <!-- 桌面侧栏 -->
  <aside class="toc-aside">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-list" aria-label="文章目录">
      <a
        v-for="item in items"
        :key="item.id"
        href="#"
        class="toc-link"
        :class="{ active: activeId === item.id, 'h3': item.level === 3 }"
        @click="(e) => jump(e, item.id)"
      >{{ item.text }}</a>
    </nav>
  </aside>
</template>

<style scoped>
.toc-title {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.toc-list { display: flex; flex-direction: column; gap: 2px; }
.toc-link {
  display: block;
  padding: 5px 10px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--text-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  border-radius: 0;
  transition: all var(--transition-fast);
  line-height: 1.5;
}
.toc-link:hover { color: var(--accent); background: var(--accent-soft); }
.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 600;
}
.toc-link.h3 { padding-left: 22px; }

/* 桌面侧栏 */
.toc-aside {
  position: sticky;
  top: calc(var(--nav-height) + 28px);
  width: 200px;
  flex-shrink: 0;
  padding: 4px 0;
}
.toc-aside .toc-list { max-height: calc(100vh - 200px); overflow-y: auto; }

/* 移动折叠 */
.toc-mobile { display: none; margin-bottom: 24px; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 14px; background: var(--bg-surface); }
.toc-mobile summary { cursor: pointer; font-weight: 600; color: var(--ink); font-family: var(--font-sans); font-size: 14px; }
.toc-mobile .toc-list { margin-top: 12px; }

@media (max-width: 1024px) {
  .toc-aside { display: none; }
  .toc-mobile { display: block; }
}
</style>
```

- [ ] **Step 3: 验证 build**

Run: `cd blog && npm run build`
Expected: 成功。

- [ ] **Step 4: Commit**

```bash
git add blog/src/components/Toc.vue blog/src/components/ReadingProgress.vue
git commit -m "feat: 新增 Toc（桌面侧栏+移动折叠）与 ReadingProgress 组件"
```

---

## Task 14: 文章详情 BlogPostView 重写（修 useSeo / TOC / 进度条 / drop cap）

**Files:**
- Modify: `blog/src/views/BlogPostView.vue`

- [ ] **Step 1: 重写 `BlogPostView.vue`**

完整替换。要点：useSeo 在 setup 顶层用 getter；scroll-spy observer 正确 disconnect；首段 drop cap；TOC 组件；阅读进度条；meta 显示阅读时长/字数；可点标签跳转博客筛选。

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import postsData from '../data/posts.json'
import { useSeo, type SeoOptions } from '../composables/useSeo'
import Toc from '../components/Toc.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import type { Post } from '../types'

const route = useRoute()
const router = useRouter()
const posts = postsData as Post[]

const post = ref<Post | undefined>(undefined)
const renderedContent = ref('')
const articleRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref(false)

interface TocItem { id: string; text: string; level: number }
const tocItems = ref<TocItem[]>([])
const activeHeading = ref('')
let spyObserver: IntersectionObserver | null = null

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

function seoOptions(): SeoOptions {
  if (post.value) {
    return {
      title: `${post.value.title} - 小满的技术随笔`,
      description: post.value.summary,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.summary,
        datePublished: post.value.date,
        keywords: post.value.tags.join(', '),
        author: { '@type': 'Person', name: '刘小满' }
      }
    }
  }
  return { title: '文章 - 小满的技术随笔', description: '小满的技术随笔' }
}

const { refresh: refreshSeo } = useSeo(seoOptions)

function clearSpy() {
  spyObserver?.disconnect()
  spyObserver = null
}

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
  clearSpy()
  spyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeHeading.value = entry.target.id
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )
  tocItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) spyObserver!.observe(el)
  })
}

async function loadArticle() {
  const id = route.params.id as string
  post.value = posts.find(p => p.id === id)
  loading.value = true
  error.value = false
  clearSpy()

  if (!post.value) {
    loading.value = false
    refreshSeo()
    return
  }

  refreshSeo()
  try {
    const modules = import.meta.glob('../../public/posts/*.md', { eager: true, query: '?raw', import: 'default' })
    const raw = modules[`../../public/posts/${post.value.id}.md`]
    if (!raw) {
      error.value = true
    } else {
      renderedContent.value = md.render(raw as string)
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }

  if (!error.value && post.value) {
    await nextTick()
    extractToc()
    setupScrollSpy()
  }
}

onMounted(loadArticle)
watch(() => route.params.id, loadArticle)
onUnmounted(clearSpy)
</script>

<template>
  <div class="post-page container">
    <ReadingProgress v-if="post && !loading && !error" />
    <button class="back-btn" @click="router.push('/blog')">← 返回文章</button>

    <!-- 加载骨架 -->
    <div v-if="loading && post" class="post-layout">
      <div class="post-content">
        <div class="skeleton" style="width: 60px; height: 22px;"></div>
        <div class="skeleton" style="width: 70%; height: 36px; margin-top: 14px;"></div>
        <div class="skeleton-lines">
          <div class="skeleton" style="width: 100%; height: 16px;"></div>
          <div class="skeleton" style="width: 92%; height: 16px;"></div>
          <div class="skeleton" style="width: 96%; height: 16px;"></div>
          <div class="skeleton" style="width: 80%; height: 16px;"></div>
        </div>
      </div>
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="state">
      <h2>文章加载失败</h2>
      <p>抱歉，文章内容暂时无法加载。</p>
      <button class="btn btn-primary" @click="loadArticle">重新加载</button>
    </div>

    <!-- 正文 -->
    <div v-else-if="post" class="post-layout">
      <article ref="articleRef" class="post-content">
        <header class="post-header">
          <span class="kicker">{{ post.category }}</span>
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <span>{{ post.date }}</span>
            <span class="dot"></span>
            <span v-if="post.readingTime">{{ post.readingTime }} 分钟阅读</span>
            <span class="dot" v-if="post.wordCount"></span>
            <span v-if="post.wordCount">{{ post.wordCount }} 字</span>
          </div>
          <div class="post-tags">
            <router-link v-for="tag in post.tags" :key="tag" :to="{ path: '/blog', query: { tag } }" class="tag">#{{ tag }}</router-link>
          </div>
        </header>
        <div class="markdown-body" v-html="renderedContent"></div>
      </article>

      <Toc v-if="tocItems.length" :items="tocItems" :active-id="activeHeading" />
    </div>

    <!-- 不存在 -->
    <div v-else class="state">
      <h2>文章未找到</h2>
      <button class="btn btn-primary" @click="router.push('/blog')">返回文章</button>
    </div>

    <!-- 上下篇 -->
    <nav v-if="post && !loading && !error" class="post-nav">
      <router-link v-if="prevPost" :to="`/blog/${prevPost.id}`" class="nav-link">
        <span class="nav-label">← 上一篇</span>
        <span class="nav-title">{{ prevPost.title }}</span>
      </router-link>
      <span v-else></span>
      <router-link v-if="nextPost" :to="`/blog/${nextPost.id}`" class="nav-link right">
        <span class="nav-label">下一篇 →</span>
        <span class="nav-title">{{ nextPost.title }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.post-page {
  padding-top: calc(var(--nav-height) + 32px);
  padding-bottom: 80px;
}
.back-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 20px;
}
.back-btn:hover { color: var(--accent-hover); }
.post-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}
.post-content {
  flex: 1;
  min-width: 0;
  max-width: var(--reading-width);
}
.post-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--rule);
}
.post-header h1 {
  font-size: clamp(26px, 4vw, 34px);
  margin: 12px 0 16px;
  line-height: 1.2;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 13px;
}
.dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); }
.post-tags { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
.post-tags .tag { text-decoration: none; }
.post-tags .tag:hover { color: var(--accent); border-color: var(--accent); }

.skeleton-lines { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; }

.state { text-align: center; padding: 80px 0; }
.state h2 { margin-bottom: 12px; }
.state p { color: var(--text-muted); margin-bottom: 24px; }

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  max-width: var(--reading-width);
  margin: 40px auto 0;
  padding-top: 28px;
  border-top: 1px solid var(--rule);
}
.nav-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  color: inherit;
  max-width: 48%;
}
.nav-link.right { text-align: right; margin-left: auto; }
.nav-label { font-size: 12px; color: var(--accent); font-family: var(--font-sans); }
.nav-title { font-size: 14px; font-weight: 600; color: var(--ink); }

/* Markdown 正文（drop cap + 暖色） */
:deep(.markdown-body) {
  font-size: 16px;
  line-height: 1.85;
  color: var(--text-body);
}
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  color: var(--ink);
  margin: 1.6em 0 0.7em;
}
:deep(.markdown-body h2) { font-size: 1.45em; padding-bottom: 0.3em; border-bottom: 1px solid var(--border); }
:deep(.markdown-body h3) { font-size: 1.2em; }
:deep(.markdown-body p) { margin: 1.1em 0; }
:deep(.markdown-body > p:first-of-type::first-letter) {
  font-family: var(--font-display);
  font-size: 3.2em;
  line-height: 0.8;
  float: left;
  padding: 6px 10px 0 0;
  color: var(--accent);
  font-weight: 600;
}
:deep(.markdown-body pre) {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  overflow-x: auto;
  margin: 1.2em 0;
  font-size: 14px;
}
:deep(.markdown-body code) { font-family: var(--font-mono); }
:deep(.markdown-body :not(pre) > code) {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
}
:deep(.markdown-body ul),
:deep(.markdown-body ol) { padding-left: 1.5em; margin: 1.1em 0; }
:deep(.markdown-body blockquote) {
  border-left: 3px solid var(--accent);
  padding: 4px 0 4px 18px;
  margin: 1.2em 0;
  color: var(--text-muted);
  font-style: italic;
  font-family: var(--font-serif-cn);
}
:deep(.markdown-body a) { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
:deep(.markdown-body img) { border-radius: var(--radius-md); margin: 1.2em 0; }
:deep(.markdown-body hr) { border: none; border-top: 1px solid var(--border); margin: 2em 0; }

@media (max-width: 1024px) {
  .post-layout { flex-direction: column; }
}
@media (max-width: 640px) {
  .post-content { max-width: 100%; }
  .post-nav { flex-direction: column; }
  .post-nav .nav-link.right { text-align: left; margin-left: 0; }
}
</style>
```

- [ ] **Step 2: 删除 global.css 中冲突的旧 `.markdown-body` 规则**

Task 1 已用全新 global.css 覆盖，旧 `.markdown-body` 规则已不存在（确认 global.css 内无 `.markdown-body` 残留；drop cap / 代码块等样式改在 BlogPostView `:deep()` 内，见上）。如 global.css 仍残留 `.markdown-body`，删除之。

- [ ] **Step 3: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev` 打开任一文章
Expected: 题头显示阅读时长/字数；首段首字下沉琥珀衬线；代码块暖色高亮（切暗色可读）；TOC 桌面侧栏高亮、移动端折叠可用；顶部进度条随滚动；标签可点跳 `/blog?tag=`；上下篇对开；切文章时 SEO/title 更新、无 JSON-LD 泄漏告警。

- [ ] **Step 4: Commit**

```bash
git add blog/src/views/BlogPostView.vue
git commit -m "feat: 文章详情重写（修 useSeo 生命周期/TOC 桌面+移动/进度条/drop cap/阅读元数据）"
```

---

## Task 15: 作品集 ProjectsView 重写

**Files:**
- Modify: `blog/src/views/ProjectsView.vue`

- [ ] **Step 1: 重写 `ProjectsView.vue`**

```vue
<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import projectsData from '../data/projects.json'
import ProjectCard from '../components/ProjectCard.vue'
import type { Project } from '../types'

const projects = projectsData as Project[]
useScrollReveal()
useSeo({
  title: '作品 - 小满的技术随笔',
  description: '刘小满的前端项目作品集。'
})
</script>

<template>
  <div class="projects container">
    <header class="page-head reveal">
      <span class="kicker">Works</span>
      <h1>作品</h1>
      <p class="subtitle">前端学习路上完成的项目</p>
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
```

- [ ] **Step 2: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev`
Expected: 暖色项目卡网格，hover 上浮+描边转琥珀+图微缩放，Demo/源码按钮可用。

- [ ] **Step 3: Commit**

```bash
git add blog/src/views/ProjectsView.vue
git commit -m "feat: 作品集页重写为暖色卡片网格"
```

---

## Task 16: 关于页 AboutView 重写（去学生简历，加旧体诗小节）

**Files:**
- Modify: `blog/src/views/AboutView.vue`

- [ ] **Step 1: 重写 `AboutView.vue`**

```vue
<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import site from '../data/site.json'

useScrollReveal()
useSeo({
  title: '关于 - 小满的技术随笔',
  description: '关于这个博客：记录 Vue、CSS、工程化等前端实践，博主亦好旧体诗。'
})

const skills = [
  { name: 'Vue 3', level: 90 },
  { name: 'JavaScript', level: 88 },
  { name: 'CSS / HTML', level: 85 },
  { name: 'TypeScript', level: 72 },
  { name: 'Vite / 工程化', level: 78 },
  { name: 'Git', level: 80 }
]
</script>

<template>
  <div class="about container">
    <header class="page-head reveal">
      <span class="kicker">About</span>
      <h1>关于</h1>
    </header>

    <section class="block reveal">
      <h2 class="block-title">关于这个博客</h2>
      <div class="prose">
        <p>这里是 <strong>{{ site.author }}</strong> 的技术随笔。我用它记录前端开发中的思考、踩过的坑与一些避坑心得——主要是 Vue 生态、CSS 与工程化的实践。</p>
        <p>比起博闻强识，我更相信把一件小事讲清楚。所以这里的文章，多是某一个具体问题的来龙去脉，而非面面俱到的清单。</p>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">写什么</h2>
      <div class="topics">
        <span v-for="t in site.topics" :key="t" class="topic">{{ t }}</span>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">技术栈</h2>
      <div class="skills">
        <div v-for="s in skills" :key="s.name" class="skill">
          <div class="skill-head"><span>{{ s.name }}</span><span class="pct">{{ s.level }}%</span></div>
          <div class="bar"><div class="fill" :style="{ width: s.level + '%' }"></div></div>
        </div>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">兼好旧体诗</h2>
      <div class="prose">
        <p>代码之外，我也写一点旧体诗词。以为敲键如推敲，字字皆平仄——技术求精确，文字求余味，二者于我皆是癖好。</p>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">联系</h2>
      <div class="contacts">
        <a :href="site.social.github" target="_blank" rel="noopener" class="contact">GitHub ↗</a>
        <a :href="`mailto:${site.social.email}`" class="contact">{{ site.social.email }}</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head { text-align: center; margin-bottom: 44px; }
.page-head h1 { font-size: clamp(28px, 5vw, 40px); margin-top: 10px; }
.block { max-width: var(--reading-width); margin: 0 auto 52px; }
.block-title {
  font-size: 16px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.prose { font-size: 15.5px; line-height: 1.85; color: var(--text-body); }
.prose p { margin-bottom: 14px; }
.prose strong { color: var(--ink); }
.topics { display: flex; gap: 10px; flex-wrap: wrap; }
.topic {
  padding: 6px 14px;
  font-size: 13.5px;
  color: var(--text-body);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.skills { display: flex; flex-direction: column; gap: 18px; }
.skill-head {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 7px;
  color: var(--ink);
}
.pct { color: var(--accent); font-weight: 600; font-family: var(--font-mono); font-size: 13px; }
.bar { height: 6px; background: var(--bg-surface-alt); border-radius: 3px; overflow: hidden; }
.fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.8s ease; }
.contacts { display: flex; gap: 24px; flex-wrap: wrap; }
.contact {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.contact:hover { color: var(--accent); }
</style>
```

- [ ] **Step 2: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev`
Expected: 关于页无学校/学生内容，含「关于博客/写什么/技术栈/兼好旧体诗/联系」五节；无 emoji 头像。

- [ ] **Step 3: Commit**

```bash
git add blog/src/views/AboutView.vue
git commit -m "feat: 关于页重写（去学生简历，加旧体诗小节）"
```

---

## Task 17: 404 NotFoundView 暖色重做

**Files:**
- Modify: `blog/src/views/NotFoundView.vue`

- [ ] **Step 1: 重写 `NotFoundView.vue`**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found container">
    <div class="nf-inner">
      <div class="code">404</div>
      <p class="line">此页如雪夜孤舟，不可寻也。</p>
      <button class="btn btn-primary" @click="router.push('/')">回到首页</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--nav-height);
}
.nf-inner { text-align: center; }
.code {
  font-family: var(--font-display);
  font-size: clamp(72px, 16vw, 140px);
  font-weight: 600;
  color: var(--ink);
  opacity: 0.14;
  line-height: 1;
  margin-bottom: 16px;
}
.line {
  font-family: var(--font-serif-cn);
  color: var(--text-body);
  margin-bottom: 28px;
  font-size: 16px;
}
</style>
```

- [ ] **Step 2: 验证 build + 目测**

Run: `cd blog && npm run build`，再 `npm run dev` 访问不存在路径
Expected: 暖色 404，大号淡墨 404 + 一句诗意提示 + 回首页按钮。

- [ ] **Step 3: Commit**

```bash
git add blog/src/views/NotFoundView.vue
git commit -m "feat: 404 页暖色重做，加诗意提示"
```

---

## Task 18: 清理（移除 glow/typewriter/死代码）+ 收尾

**Files:**
- Modify: `blog/src/main.ts`
- Delete: `blog/src/composables/useCardGlow.ts`
- Delete: `blog/src/composables/useTypewriter.ts`

- [ ] **Step 1: 从 main.ts 移除 v-glow 注册**

`blog/src/main.ts` 删除两处：
- `import { vGlow } from './composables/useCardGlow'`
- `app.directive('glow', vGlow)`

最终 main.ts 形如：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/code-theme.css'
import './assets/styles/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

import { useThemeStore } from './stores/theme'
const theme = useThemeStore()
theme.init()

app.mount('#app')
```

- [ ] **Step 2: 删除不再使用的 composables**

```bash
rm blog/src/composables/useCardGlow.ts blog/src/composables/useTypewriter.ts
```

- [ ] **Step 3: 全局检索残留引用**

Run（在仓库根）：
```bash
cd d:/man-blog && grep -rn "v-glow\|useCardGlow\|useTypewriter" blog/src || echo "无残留"
```
Expected: 输出「无残留」。若有命中，逐一移除。

- [ ] **Step 4: 终极 build 验证**

Run: `cd blog && npm run build`
Expected: vue-tsc 类型检查通过，Vite 构建成功，无未使用 import 报错。

- [ ] **Step 5: 全站目测验收（对照 spec 验收标准）**

Run: `cd blog && npm run dev`，逐项核对：
1. 亮/暗主题全站正确，代码块暗色可读且配色统一。
2. 首页：刊头 + 卷首题记（改 site.json 可换）+ 精选 + 最新 + 作品；无虚荣数字、无学生表述、无 emoji。
3. `/blog`：分类 + 标签叠加，URL `?cat=&tag=` 回填。
4. `/blog/:id`：阅读时长/字数、TOC 桌面+移动、上下篇、进度条、drop cap 正常。
5. `/tags` 标签云可点跳筛选。
6. `/about` 无学校/学生内容，含旧体诗小节。
7. 搜索浮层（⌘K）按标题/摘要/标签过滤。
8. 旧 bug 不复现；无 `v-glow`/打字机残留。

- [ ] **Step 6: Commit 清理**

```bash
git add blog/src/main.ts blog/src/composables
git commit -m "chore: 移除卡片光晕与打字机（杂志风不再使用）"
```

---

## Self-Review（计划完成后自检，已执行）

**1. Spec 覆盖：**
- 设计系统（配色/字体/排版/代码主题）→ Task 1、2 ✓
- 卷首题记可换（数据驱动）→ Task 3 site.json + Task 7 Epigraph ✓
- 阅读时长/字数 → Task 3 脚本 + Task 14 显示 ✓
- 搜索升级（标题/摘要/标签）→ Task 4 useSearch + Task 9 浮层 ✓
- 标签页/按标签筛选 → Task 11（BlogView 标签筛选）+ Task 12（TagsView）✓
- 首页精选文章位 → Task 7 FeaturedPost + Task 10 ✓
- 六页全面重构 + 404 → Task 10、11、14、15、16、17 ✓
- bug 清单 1–10 → Task 2(#1)、Task4/14(#2)、Task1(#3)、Task13/14(#4)、Task18(#5/#7)、Task14(#6)、Task16(#8/#9)、Task18(#10) ✓
- 去学生定位 → Task 16 About 重写、Task 10 HomeView 无学生表述 ✓

**2. 占位扫描：** 无 TBD/TODO；每个代码步骤均含完整代码。

**3. 类型一致性：** `useSeo` 签名（`SeoOptions | getter`）在 Task 4 定义、Task 14 使用一致；`filterPosts` 在 Task 4 定义、Task 9 使用一致；`Toc` props `items/activeId` 在 Task 13 定义、Task 14 使用一致；`Post.featured/readingTime/wordCount` 在 Task 3 类型与数据中一致，组件读取一致。

**4. 已知执行注意：** Task 5 路由先于 Task 12 创建 TagsView —— Vite 懒加载在构建期不解析，`npm run build` 可过；若开发期先访问 `/tags` 会报缺组件，按序执行无碍。

---

## 执行交接

计划已保存至 `docs/superpowers/plans/2026-06-17-blog-magazine-redesign.md`。两种执行方式：

**1. Subagent-Driven（推荐）** — 每个 Task 派一个全新 subagent 执行，任务间我来 review，迭代快、上下文干净。

**2. Inline Execution** — 在当前会话内按 executing-plans 批量执行，带检查点。

选哪种？