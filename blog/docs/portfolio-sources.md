# 作品内容来源

核验日期：2026-09-09。所有项目属于用户指定的公开 GitHub 账号 [TheKingOfLxm](https://github.com/TheKingOfLxm)。按已确认的功能范围与工程结构选取较完整的应用，而非按 GitHub 仓库字节数排名；公共 API 当时受访问限额影响，未展示未经核实的体积、星数或运行指标。

## 古代科技可视化

- [仓库](https://github.com/TheKingOfLxm/ancient-science-visualization)
- [package.json](https://github.com/TheKingOfLxm/ancient-science-visualization/blob/main/package.json)：Vue 3、Three.js、ECharts、GSAP、Pinia。
- [路由](https://github.com/TheKingOfLxm/ancient-science-visualization/blob/main/src/router/index.js)：欢迎页、3D 导航、科技展览、数据看板、AI 问答页面入口。
- [Scene3D.vue](https://github.com/TheKingOfLxm/ancient-science-visualization/blob/main/src/views/Scene3D.vue)：Three.js Water / Sky、CSS3DRenderer、射线交互和 GSAP 场景过渡。
- [IndexMain.vue](https://github.com/TheKingOfLxm/ancient-science-visualization/blob/main/src/views/IndexMain.vue)：组合多个数据可视化模块。README 为默认模板，介绍依据源码整理。未验证远程 AI 服务，因此卡片不承诺 AI 功能可用。

## 校园商会管理系统

- [仓库与 README](https://github.com/TheKingOfLxm/Commerce-Management-System)
- README 说明 uni-app + Vue 3，H5 / 微信小程序，4 个 Tab 和 19 个子页面，包含项目、会员、财务、消息等模块。
- README 的工程结构包含 Pinia、TypeScript 类型、API 层、Hooks、SCSS 与 Mock 数据；近期提交也说明集成 Mock 数据。卡片将其表述为跨端业务界面，不承诺已连接真实业务后台。
- 仓库名称中的 Commerce 在这里对应“商会”，不是电商商城。

## 即我

- [仓库](https://github.com/TheKingOfLxm/jiwo)
- [package.json](https://github.com/TheKingOfLxm/jiwo/blob/main/package.json)：React 18、TypeScript、Tailwind CSS、Vite。
- [App.tsx](https://github.com/TheKingOfLxm/jiwo/blob/main/src/App.tsx)：records / arrangements / insight / mine 页面类型。
- [Home.tsx](https://github.com/TheKingOfLxm/jiwo/blob/main/src/pages/Home.tsx)：会话、记录、安排、详情组件及本地记录存储。
- 仓库提交历史包含 arrangements v0.1 手动创建、删除后关闭详情的实现记录；根目录包含安排、完成列表和详情的验证图片。
- README 中有原始需求和未来设想，不能据此声称已实现 AI 自动识别或线上服务。卡片只描述已核实的会话、记录与安排交互。

## 小满博客

- [仓库](https://github.com/TheKingOfLxm/man-blog)，与本地 Git remote 一致。
- 技术栈与功能根据当前工作区源码核对。搜索针对文章索引，表述为“文章搜索”。
- 当前站点作为个人网站项目保留在第四项，前两项优先展示可视化与跨端业务项目。

## 展示约定

- 数据源：`src/data/projects.json`，首页和作品页共用。
- 封面：`ProjectCover.vue` 中的 CSS 概念图，体现对应项目主题，不冒充实机截图。
- 未确认公开部署地址，因此所有项目保留源码入口，不填写猜测的演示链接。
- 不引用需求文档里的执行指令，不运行其他仓库提供的脚本。
