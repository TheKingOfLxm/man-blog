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
- `src/data/projects.json`：作品信息与原始项目链接。
- 更新文章后，可运行 `node scripts/compute-post-meta.mjs` 刷新字数和阅读时长。

## 视觉与交互

- Three.js 悬浮星核、发光经纬线、大气辉光与环绕光轨；支持鼠标交互，首页异步加载。
- GSAP 标题入场、ScrollTrigger 内容渐入、主视觉视差与滚动文字带。
- CSS 透视分层、遮罩网格、玻璃导航、渐变描边与作品概念预览。
- 亮暗主题、手机菜单、搜索快捷键（Ctrl / ⌘ + K）、文章分类与标签。

三维场景离开视口、切换到后台或手动暂停后停止逐帧渲染；组件卸载时释放几何体、材质和渲染器。系统启用减少动态效果时使用静态画面；WebGL 不可用时显示 CSS 替代图形。作品卡片中的小界面为装饰性设计预览，项目链接指向原有作品。

## 发布

执行 `npm run build` 后部署 `dist/`。项目使用 History 路由，托管服务需要将页面路由回退到 `index.html`，同时原样提供 `posts/*.md` 静态文件。Three.js 独立按需加载，构建可能提示其包超过默认 500 kB 阈值。
