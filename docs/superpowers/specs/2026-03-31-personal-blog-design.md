# 个人博客网站设计文档

## 概述

为一名大四前端开发者设计个人博客网站，兼具求职作品展示和技术分享功能。

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **语言**: TypeScript
- **样式**: 原生 CSS (CSS Variables 实现主题切换)
- **Markdown 渲染**: markdown-it + highlight.js
- **部署目标**: GitHub Pages / Vercel（纯静态）

## 设计风格

**毛玻璃拟态 + 浅薄荷清新色调**

### 配色方案（亮色模式）

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#e8faf0` → `#d4f5e3` | 淡薄荷渐变 |
| 卡片背景 | `rgba(255,255,255,0.7)` | 白色半透明 + backdrop-filter |
| 主色 | `#5ec696` | 薄荷绿，按钮/标签/链接 |
| 强调色 | `#3db37a` | hover 态、活跃态 |
| 标题文字 | `#2d7a50` | 深绿 |
| 正文文字 | `#5a9a78` | 中绿 |
| 边框 | `rgba(94,198,150,0.15)` | 极淡绿边框 |

### 暗色模式

暗色模式下背景变为深色 (`#0f1f17`)，卡片用深色半透明毛玻璃，薄荷绿色更亮更突出。

### 设计元素

- **毛玻璃卡片**: 所有内容区块使用 `backdrop-filter: blur()` + 白色半透明背景
- **圆角**: 统一 12px-16px 大圆角
- **阴影**: 极淡的绿色投影，不用灰色阴影
- **滚动动画**: Intersection Observer 驱动，元素渐入
- **响应式**: 移动端自适应，汉堡菜单

## 页面结构

### 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 Hero | 个人介绍 + 快速导航 |
| `/blog` | 博客列表 | 文章卡片列表 + 分类筛选 |
| `/blog/:id` | 博客详情 | Markdown 渲染的文章 |
| `/projects` | 作品集 | 项目展示卡片 |
| `/about` | 关于我 | 简历/经历/技能 |

### 各页面内容

#### 1. 首页 Hero (`/`)

- 顶部导航栏（毛玻璃效果，滚动后固定）
- 大头像 + 姓名 + 一句话定位（"大四学生 · 两年前端经验 · 热爱创造"）
- 技能标签云（Vue, React, TypeScript, CSS, Node.js 等）
- 两个 CTA 按钮："查看作品" → `/projects`，"阅读博客" → `/blog`
- 下方最近文章/项目的快速预览

#### 2. 博客列表 (`/blog`)

- 顶部分类筛选标签（全部 / Vue / CSS / 工程化 / 随笔）
- 文章卡片网格（2-3列），每张卡片：标题 + 摘要 + 日期 + 分类标签
- 搜索框（标题关键词过滤）

#### 3. 博客详情 (`/blog/:id`)

- 返回按钮
- 文章标题 + 日期 + 分类
- Markdown 渲染正文（代码高亮）
- 上一篇/下一篇文章导航

#### 4. 作品集 (`/projects`)

- 项目卡片网格，每张卡片：
  - 项目截图/预览图
  - 项目名称 + 简介
  - 技术栈标签
  - "查看 Demo" / "查看源码" 按钮
- hover 时卡片微上浮 + 阴影加深

#### 5. 关于我 (`/about`)

- 个人简介段落
- 技能雷达图/进度条（前端技能可视化）
- 学习经历时间线（大二开始学前端 → 至今）
- 联系方式（GitHub、邮箱、微信等图标链接）

## 组件结构

```
src/
├── App.vue                    # 根组件，含导航栏
├── main.ts                    # 入口
├── router/index.ts            # 路由配置
├── stores/
│   └── theme.ts               # 明暗主题状态
├── views/
│   ├── HomeView.vue           # 首页
│   ├── BlogView.vue           # 博客列表
│   ├── BlogPostView.vue       # 博客详情
│   ├── ProjectsView.vue       # 作品集
│   └── AboutView.vue          # 关于我
├── components/
│   ├── NavBar.vue             # 导航栏（毛玻璃固定）
│   ├── ThemeToggle.vue        # 明暗切换按钮
│   ├── HeroSection.vue        # 首页英雄区
│   ├── BlogCard.vue           # 博客文章卡片
│   ├── CategoryFilter.vue     # 分类筛选
│   ├── ProjectCard.vue        # 项目卡片
│   ├── SkillChart.vue         # 技能展示
│   ├── Timeline.vue           # 时间线组件
│   ├── ContactLinks.vue       # 联系方式
│   └── ScrollReveal.vue       # 滚动动画包装器
├── data/
│   ├── posts.json             # 博客文章数据
│   └── projects.json          # 项目数据
├── composables/
│   └── useScrollReveal.ts     # 滚动动画逻辑
├── assets/
│   └── styles/
│       ├── variables.css      # CSS 变量（主题色）
│       └── global.css         # 全局样式 + 毛玻璃工具类
└── types/
    └── index.ts               # TypeScript 类型定义
```

## 数据结构

### posts.json

```json
[
  {
    "id": "vue3-composition-api",
    "title": "Vue 3 Composition API 实践心得",
    "summary": "从 Options API 迁移到 Composition API 的经验总结",
    "content": "posts/vue3-composition-api.md",
    "category": "Vue",
    "date": "2026-03-15",
    "tags": ["Vue 3", "Composition API", "前端"]
  }
]
```

### projects.json

```json
[
  {
    "id": "todo-app",
    "title": "待办事项应用",
    "description": "基于 Vue 3 + TypeScript 的全功能待办应用",
    "image": "/images/projects/todo.png",
    "tags": ["Vue 3", "TypeScript", "Pinia"],
    "demo": "https://todo-demo.vercel.app",
    "source": "https://github.com/xxx/todo-app"
  }
]
```

## 关键交互

1. **导航栏**: 初始透明，滚动后变为毛玻璃效果固定在顶部
2. **主题切换**: 右上角切换按钮，CSS Variables 瞬间切换，存入 localStorage
3. **滚动动画**: 使用 Intersection Observer，元素进入视口时 fadeIn + slideUp
4. **博客分类**: 点击标签过滤，带过渡动画
5. **项目卡片 hover**: translateY(-4px) + 阴影增强

## 约束

- 无后端，所有数据本地 JSON
- 博客正文用 Markdown 文件存储，构建时读取
- 示例数据用真实前端相关内容（非 lorem ipsum）
- 不引入 UI 组件库，手写 CSS 展示前端能力
- 支持 Chrome / Firefox / Safari / Edge 最新版
