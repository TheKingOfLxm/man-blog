# 小满的技术随笔

Vue 3 + TypeScript 个人博客，采用深空黑与酸橙绿的创作室视觉。

## 开发

```sh
npm install
npm run dev
npm run build
npm run preview
```

## 内容

- `src/data/site.json`：作者、社交链接及站点信息。
- `src/data/posts.json`：文章索引；Markdown 正文位于 `public/posts/`，阅读时按需请求。
- `src/data/projects.json`：GitHub 精选作品、技术栈、亮点与真实仓库链接。首页展示前两项，作品页展示全部。
- `src/data/literature.json`：原创诗词，诗集 `/poems` 与词集 `/ci` 独立展示，单篇地址为板块路径加作品 ID。`kind` 区分 `shi` / `ci`，`stanzas` 保留原文及上下阕，词牌存入 `tune`。
- 本次录入 1 首诗、11 首词，重复提交的《临江仙》收录一次。标题、正文及标点保持原样，未添加写作日期。
- `docs/portfolio-sources.md`：作品内容来源与核验依据；更新项目介绍时一起维护。
- 更新文章后，可运行 `node scripts/compute-post-meta.mjs` 刷新字数和阅读时长。
- 诗词内容校验：`node --test tests/literature.test.mjs`（Node.js 24）。校验原稿、分类、唯一链接、句读排版与正文搜索；原稿基准在 `tests/fixtures/literature-original.txt`。

## 视觉与交互

- Three.js 悬浮星核、发光经纬线、大气辉光与环绕光轨；支持鼠标交互，首页异步加载。
- GSAP 标题入场、ScrollTrigger 内容渐入、主视觉视差与滚动文字带。
- CSS 透视分层、遮罩网格、玻璃导航、渐变描边与作品概念预览。
- 亮暗主题、手机菜单、搜索快捷键（Ctrl / ⌘ + K）、文章分类与标签。
- 首页诗词入口、独立诗集与词集、词牌筛选、诗句搜索与单篇阅读；站内搜索同时收录诗词。
- 自定义精细光标、惯性光环与「查看 / 阅读」胶囊，鼠标光晕、卡片追光与作品倾斜，导航及主要按钮轻微磁吸。动效只在支持悬停的精确指针设备上启用；尊重减少动态效果设置，打开搜索、切换路由或离开窗口时恢复系统光标，鼠标停止后暂停动画帧。

三维场景离开视口、切换到后台或手动暂停后停止逐帧渲染；组件卸载时释放几何体、材质和渲染器。系统启用减少动态效果时使用静态画面；WebGL 不可用时显示 CSS 替代图形。

作品封面为 `ProjectCover.vue` 绘制的主题概念图，并非项目实机截图；使用 CSS 透视和容器查询，不依赖外部图片加载。封面、标题和源码按钮均链接到对应的公开仓库。只有确认存在可访问的演示地址后才填写 `demo`。

## 发布

执行 `npm run build` 后部署 `dist/`。项目使用 History 路由，托管服务需要将页面路由回退到 `index.html`，同时原样提供 `posts/*.md` 静态文件。Three.js 独立按需加载，构建可能提示其包超过默认 500 kB 阈值。
