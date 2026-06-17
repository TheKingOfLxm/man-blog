# 博客「暖色杂志风」全面重构设计文档

> 日期：2026-06-17
> 对象：`blog/`（Vue 3 + TS + Vite + Pinia 个人博客）
> 目标：把现有「薄荷绿毛玻璃」博客**全面重构**为「**暖色杂志风**」，并补齐功能、修复既有缺陷。

## 1. 背景与定位

- 博主**刘小满**，前端开发者，**已毕业**；本博客定位为**纯技术随笔记录**（去掉一切「大四 / 学校 / 求职 / 学习历程」表述）。
- 博主**兼好旧体诗创作**，是重要的个人气质，需在设计中体现（刊头「卷首题记」位放一首可更换的古典诗词）。
- 设计取向：**暖色杂志风（Warm Editorial）**——奶油底 + 琥珀强调 + 衬线刊名 + 编辑感排版，远离通用 AI 模板感。

## 2. 核心决策（已与用户确认）

| 项 | 决策 |
|---|---|
| 视觉方向 | B · 暖色杂志风（奶油 `#faf6ef` + 琥珀 `#c2410c` + 衬线） |
| 改动力度 | **全面重构**：每个页面按杂志产品重做 |
| 博主定位 | 已毕业，纯技术随笔；**去除**学生/学校/求职色彩 |
| 卷首题记 | 放一首可更换的词（当前：蒋捷《梅花引·荆溪阻雪》），**数据驱动、可换** |
| 刊名 | 保持「**刘小满的技术随笔**」 |
| 数据条 | **去除**虚荣数字（篇数/项目数等），改为「主题标签 + 卷首题记」 |
| 新增功能 | ① 阅读时长 + 字数 ② 搜索升级（标题+摘要+标签）③ 标签页/按标签筛选 ④ 首页精选文章位 |
| bug 修复 | 暗色模式代码不高亮、`useSeo` 生命周期、字体未加载、TOC 移动端消失、死 CSS、scroll-spy 泄漏等（默认全修） |

## 3. 设计系统

### 3.1 配色（CSS 变量，亮 / 暖深双主题）

**亮色（默认 `:root`）**
```
--bg-page:        #faf6ef   /* 奶油底 */
--bg-surface:     #fffdf8   /* 纸面 / 卡片 */
--bg-surface-alt: #f3ece0   /* 次级面 */
--ink:            #1c1917   /* 墨色标题 */
--text-body:      #57534e   /* 正文 */
--text-muted:     #8c857c
--text-faint:     #a8a096
--accent:         #c2410c   /* 琥珀强调 */
--accent-hover:   #9a3412
--accent-soft:    rgba(194,65,12,.10)
--rule:           #1c1917   /* 实线分隔（墨色） */
--border:         #e7ddcd   /* 米色描边 */
--border-soft:    #efe7d8
--code-bg:        #f7f1e6   /* 代码块底 */
--shadow:         0 1px 3px rgba(28,25,23,.04), 0 8px 24px rgba(28,25,23,.06)
```

**暖深色（`[data-theme='dark']`）**
```
--bg-page:        #1a1714   /* 暖炭 */
--bg-surface:     #241f1a
--bg-surface-alt: #2c2620
--ink:            #f5efe4
--text-body:      #c9bfb0
--text-muted:     #9b9082
--text-faint:     #7c7264
--accent:         #fb923c   /* 亮琥珀 */
--accent-hover:   #fdba74
--accent-soft:    rgba(251,146,60,.12)
--rule:           #f5efe4
--border:         #3a322a
--border-soft:    #2e2822
--code-bg:        #211c17
--shadow:         0 1px 3px rgba(0,0,0,.3), 0 10px 30px rgba(0,0,0,.35)
```

主题切换沿用现有 Pinia store + `data-theme` + View Transition 圆形扩散（保留，效果好）。

### 3.2 字体（`index.html` 经 Google Fonts 加载，preconnect 已就绪）

| 角色 | 字体栈 |
|---|---|
| 刊名 / 标题（display） | `'Fraunces', 'Noto Serif SC', Georgia, serif`（Fraunces 可变衬线，带光学风味；思源宋体兜中文） |
| 正文 | `'Inter', 'Noto Sans SC', system-ui, sans-serif` |
| 等宽 / 代码 / 编号 | `'JetBrains Mono', ui-monospace, monospace` |
| 古典题记 / 诗词 | `'Noto Serif SC', 'Fraunces', serif` |

**加载字重**：Fraunces (wght 400,600,9pt opsz, italic)、Noto Serif SC (500,700)、Inter (400,500,600,700)、Noto Sans SC (400,500,700)、JetBrains Mono (400,500)。

### 3.3 排版规范

- **分节标签**：`01 —`（mono 琥珀编号）+ 衬线小标题 + 右侧「查看全部 →」。
- **分隔线**：刊头双实线（2px 墨色），分节单细线（1px 墨色），卡片用米色描边。
- **正文行高** 1.75；文章首段**首字下沉（drop cap）**，衬线、琥珀，强化编辑感。
- **引用块**：左侧 3px 琥珀竖线 + 斜体衬线。
- **链接**：正文内 `color: accent` + 下划线偏移；hover 加深。
- **圆角**：卡片 12–14px，按钮 8–10px，标签胶囊或直角小方块（杂志偏直角，标签用 2px 微圆角方块）。
- **动效**：保留滚动渐入（IntersectionObserver），节奏更克制（位移 16px、时长 0.5s）；卡片 hover 轻微上浮 + 描边转琥珀 + 阴影加深。

### 3.4 代码高亮（自定暖色主题，修暗色 bug）

不再直接用 hljs 官方 theme CSS（它是全局的，亮暗无法切换）。改为：**自定义 `.hljs` token 配色，用 CSS 变量驱动亮/暗双主题**，与全站色板统一。

```
:root{
  --code-bg:#f7f1e6; --code-text:#3f3a32;
  --c-keyword:#b45309; --c-string:#15803d; --c-number:#9a3412;
  --c-comment:#a8a096; --c-fn:#1c1917; --c-title:#7c2d12;
  --c-attr:#92400e; --c-built_in:#047857;
}
[data-theme='dark']{
  --code-bg:#211c17; --code-text:#d6cdbf;
  --c-keyword:#fbbf24; --c-string:#86efac; --c-number:#fdba74;
  --c-comment:#7c7264; --c-fn:#f5efe4; --c-title:#fed7aa;
  --c-attr:#fcd34d; --c-built_in:#6ee7b7;
}
```
配 hljs 各 token class（`.hljs-keyword/.string/.number/.comment/.title/.attr/.built_in/...`）→ 对应变量。行号可选（暂不加，保简洁）。

## 4. 信息架构与路由

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | 首页（杂志封面） | 刊头 + 卷首题记 + 精选文章 + 最新文章 + 精选作品 |
| `/blog` | 文章（编辑档案） | 分类 tabs + 标签筛选 + 搜索 + 文章网格；支持 `?cat=&tag=&q=` 查询 |
| `/blog/:id` | 文章详情 | 题头 + 下沉首字 + 正文 + TOC（桌面侧栏 / 移动折叠）+ 阅读进度条 + 上下篇 |
| `/tags` | 标签索引 | 全部标签（按数量大小成「云」）+ 分类，链到 `/blog?tag=` |
| `/projects` | 作品集 | 暖色项目卡片网格 |
| `/about` | 关于 | 关于本博客 + 写什么 + 技术栈 + 旧体诗 + 联系（**重做，非学生简历**） |
| `/:pathMatch*` | 404 | 暖色 + 一句诗意提示 |

主导航保持精简：**首页 / 文章 / 作品 / 关于**（标签不进主 nav，从文章页与正文 tag 进入）。

## 5. 数据结构变更

### 5.1 `posts.json` 增字段
```jsonc
{
  "id": "vue3-reactive-principle",
  "title": "深入理解 Vue 3 响应式原理",
  "summary": "...",
  "content": "posts/vue3-reactive-principle.md",
  "category": "Vue",
  "date": "2026-03-20",
  "tags": ["Vue 3", "Proxy"],
  "featured": true,          // 新增：是否首页精选（仅 1 篇标 true，缺省取最新）
  "readingTime": 8,          // 新增：分钟（构建期计算）
  "wordCount": 1280          // 新增：字数（构建期计算）
}
```

### 5.2 新增 `src/data/site.json`（站点 + 可换题记）
```jsonc
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
> 题记**完全数据驱动**：改 `site.json` 即换词，无需动代码。每片（stanza）一段，渲染时按逗号也可不强断行（CSS 控制换行）。

### 5.3 计算阅读时长（构建期，新增 `blog/scripts/compute-post-meta.mjs`）
- 读 `public/posts/*.md`，去 markdown 语法与代码块；
- 计数：CJK 字符数 + 拉丁单词数；
- `readingTime = ceil(cjk/400 + latinWords/200)`，`wordCount = cjk + latinWords`；
- 回写进 `posts.json`。**首次实现时人工跑一次并提交结果**；脚本供以后新增文章时运行。

## 6. 组件结构（重构后）

```
src/
├── components/
│   ├── NavBar.vue          # 重做：固定细栏（小刊名 + 导航 + 搜索入口 + 主题）
│   ├── Masthead.vue        # 新增：首页大刊头（kicker + 刊名 + 卷期 + 双实线）
│   ├── Epigraph.vue        # 新增：卷首题记（读 site.json，思源宋体）
│   ├── FeaturedPost.vue    # 新增：首页精选文章（文 + 装饰图块）
│   ├── PostCard.vue        # 新增：编辑感文章卡（分类小标 + 衬线标题 + 摘要 + 阅读时长）
│   ├── ProjectCard.vue     # 重做：暖色项目卡
│   ├── TagFilter.vue       # 新增：标签筛选条（与分类并列）
│   ├── SearchOverlay.vue   # 新增：搜索浮层（标题+摘要+标签），⌘K / 点放大镜唤起
│   ├── Toc.vue             # 重做：目录（桌面 sticky 侧栏 + 移动折叠 disclosure）
│   ├── ReadingProgress.vue # 新增：文章页顶部阅读进度条
│   ├── BackToTop.vue       # 保留，换暖色
│   └── ThemeToggle.vue     # 保留（View Transition），换暖色
├── composables/
│   ├── useScrollReveal.ts  # 修：作用域限定到组件根 + refresh；去全局 querySelector 风险
│   ├── useSeo.ts           # 修：仅限 setup 顶层调用；支持响应式更新
│   ├── useSearch.ts        # 新增：按 标题/摘要/标签 过滤
│   ├── useReadingTime.ts   # 新增：详情页兜底计算（若 json 缺字段）
│   └── useCardGlow.ts      # 弃用（杂志风不用鼠标光晕）；从 main.ts 移除注册
├── stores/theme.ts         # 保留
├── data/{posts.json, projects.json, site.json}
└── views/  HomeView / BlogView / BlogPostView / ProjectsView / AboutView / TagsView / NotFoundView
```

> 删除：`useTypewriter.ts`（首页不再用打字机）、`useCardGlow.ts`（杂志风去光晕）。`v-glow` 指令从 `main.ts` 移除，模板里所有 `v-glow` 一并去掉。

## 7. 逐页设计

### 7.1 首页 HomeView（杂志封面）
- `Masthead`（kicker「Frontend · 技术随笔」+ 衬线大刊名 + 卷期 + 双实线）
- `Epigraph`（卷首题记，可换）
- `FeaturedPost`：左文（分类小标「精选 · Vue」+ 衬线大标题 + 摘要 + 日期/阅读时长/标签 + 「阅读全文 →」下划线 CTA），右侧装饰图块（`{}` 等宽水印 + 衬线大字「Vue.」）。featured 取 `featured:true`，缺省取最新一篇。
- `01 — 最新文章`：3 篇 `PostCard`，顶部 1px 墨线，编辑三栏。
- `02 — 精选作品`：2 个 `ProjectCard` 预览 + 「全部作品 →」。
- 移除：虚荣数据条、打字机、emoji 头像。

### 7.2 文章列表 BlogView（编辑档案）
- 页头：「文章」衬线标题 + 副标题。
- 过滤栏：**分类 tabs**（全部/Vue/CSS/工程化/随笔）+ **标签筛选条**（`TagFilter`，源自全部 tags，可单选叠加）+ **搜索**（点击唤起 `SearchOverlay`）。
- 文章网格：2 栏 `PostCard`（分类小标 / 衬线标题 / 摘要 / 日期·阅读时长 / 标签）。带过渡。
- 空态：「没有找到匹配的文章」。
- 支持 URL 查询 `?cat=Vue&tag=Proxy&q=响应`，便于从正文 tag、首页 deep link。

### 7.3 文章详情 BlogPostView
- 返回链接（「← 返回文章」）。
- 题头：分类小标 + 衬线大标题 + meta（日期 · 阅读时长 · 字数 · 标签 chips 可点）。
- 正文：`markdown-body`，首段 drop cap；标题衬线；引用琥珀竖线；代码块自定暖色主题（亮/暗）。
- `ReadingProgress` 顶部细进度条。
- `Toc`：桌面 sticky 侧栏（滚动高亮）；**移动端不再隐藏**，改为正文上方可折叠「目录」disclosure。
- 上下篇导航：暖色卡片式，左右对开。
- 修：`useSeo` 改为 setup 顶层调用一次（响应式随 post 更新）；scroll-spy observer 在 unmount / 重载时 disconnect。

### 7.4 标签索引 TagsView（`/tags`）
- 页头「标签索引」。
- 分类区 + 标签云：按出现次数映射字号大小，hover 琥珀；点击 → `/blog?tag=xxx`。
- 提供回到「全部文章」入口。

### 7.5 作品集 ProjectsView
- 页头「作品」。
- `ProjectCard` 网格（暖色描边卡片 + 预览图 + 标题 + 简介 + 标签 + Demo/源码 按钮）。hover 上浮、描边转琥珀、图微缩放。

### 7.6 关于 AboutView（重做，非学生简历）
- **关于这个博客**：一段说明（技术随笔记录）。
- **写什么**：主题标签 + 一句话。
- **技术栈**：保留技能条（暖色重做）。
- **兼好旧体诗**：新增小节，一句话点出旧体诗爱好 + 可放一句短词或留白（不放整首，避免与卷首重复）。
- **联系**：GitHub、邮箱（用文字链接 + 简洁图标，去 emoji 🐙📧）。
- 移除：学校时间线、学生简介、🏔️ emoji 头像、`中南民族大学/大四` 等表述。

### 7.7 404 NotFoundView
- 暖色，大「404」墨色淡描 + 一句诗意提示（如「此页如雪夜孤舟，不可寻也。」）+ 回首页按钮。

## 8. bug 修复清单（默认全做）

| # | 问题 | 修复 |
|---|---|---|
| 1 | 暗色模式代码不高亮（只 import 了 light） | 自定 hljs 配色，CSS 变量驱动亮/暗（见 3.4） |
| 2 | `useSeo` 在 `loadArticle` 异步体内调用 `onUnmounted/watch`（生命周期时机错误，JSON-LD 泄漏） | `BlogPostView` setup 顶层调用一次 `useSeo`，内部用响应式 source |
| 3 | 字体声明了 `'Inter'/'JetBrains Mono'` 却从未加载 | `index.html` 经 Google Fonts 加载 Fraunces/Noto Serif SC/Inter/Noto Sans SC/JetBrains Mono |
| 4 | TOC 在 `<1024px` 直接消失 | 移动端改为折叠 disclosure，桌面侧栏 |
| 5 | 死 CSS：`.hero-subtitle`、`.project-placeholder` | 删除 |
| 6 | scroll-spy `IntersectionObserver` 从不 disconnect | 保存引用，unmount/重载时 disconnect |
| 7 | `useScrollReveal` 全局 `querySelectorAll('.reveal')` 跨组件误捕 | 限定到组件根 `root.value` 内查询 |
| 8 | About 头像为 emoji 占位 | 去掉头像或改衬线首字母 monogram |
| 9 | 多处 emoji 图标（🐙📧🏔️） | 换文字 / SVG 图标，统一气质 |
| 10 | 首页打字机/卡片光晕与新风格冲突 | 移除 `useTypewriter`、`useCardGlow` 及其注册与模板用法 |

## 9. 可访问性 / 性能 / 兼容
- 保留 `:focus-visible`、`aria-*`、`prefers-reduced-motion`（为动画降级）。
- 字体 `display=swap`；首屏关键字体可考虑 `preload`。
- 沿用 Chrome/Firefox/Safari/Edge 最新版目标；View Transition 不支持时降级直切（已处理）。
- 滚动监听：NavBar/BackToTop/ReadingProgress 各自 throttle 或合并到单一 `useScroll`（实现时合并，减少监听数）。

## 10. 不做的事（YAGNI）
- 不加后端 / 评论 / 后台 CMS。
- 不引入 UI 组件库（继续手写 CSS 展示前端能力）。
- 不加标签独立详情页（标签只做筛选，不做 tag 详情页内容聚合）。
- 不做 i18n、不做暗色单独配色之外的第三主题。
- 题记暂不做「多首轮播」，只做单首可换（数据驱动即可，以后易扩展）。

## 11. 验收标准
1. 亮/暗主题全站正确，**代码块在暗色下可读**且配色统一。
2. 首页：刊头 + 卷首题记（改 `site.json` 可换）+ 精选 + 最新 + 作品，无虚荣数字、无学生表述、无 emoji 头像。
3. 文章列表：分类 + 标签 + 搜索三者可叠加，URL 查询可回填。
4. 文章详情：阅读时长/字数显示，TOC 桌面+移动均可用，上下篇、进度条、drop cap 正常。
5. `/tags` 标签云可点跳转筛选。
6. 关于页无学校/学生内容，含旧体诗小节。
7. 旧 bug（2、4、6、7）不复现；无死 CSS、无残留 `v-glow`/打字机。
8. `npm run build`（含 `vue-tsc`）通过，类型无错。
