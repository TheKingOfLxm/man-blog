## 前言

一份可复用的「后台架子搭建指南」——不讲具体技术栈，只讲套路。

## 一、为什么要先把"架子"搭好

后台管理系统的业务模块会越来越多（用户、订单、权限、内容、统计……），但底层架构基本不变：

- 登录登出 + 路由守卫
- 网络请求 + 错误处理
- 全局状态 + 权限控制
- 列表/表单/详情三种典型页面模式

如果每个新模块都重新造一遍轮子，半年后项目就会变成「屎山」。先花 20% 的时间搭好架子，后 80% 的业务就只是填空题。

## 二、后台系统的"标准五层架构"

任何后台系统都可以拆成五层。层与层之间单向依赖，职责清晰，这才是可维护的关键：

```
┌─────────────────────────────────────────┐
│  ① 视图层 View   ──  写组件、绑事件、渲染 UI   │
├─────────────────────────────────────────┤
│  ② 状态层 Store  ──  跨组件共享、业务编排      │
├─────────────────────────────────────────┤
│  ③ 路由层 Router ──  静态路由 + 动态权限路由   │
├─────────────────────────────────────────┤
│  ④ API 层        ──  封装 HTTP、类型先行      │
├─────────────────────────────────────────┤
│  ⑤ 工具层 Utils  ──  request/auth/storage   │
└─────────────────────────────────────────┘
```

依赖方向严格自上而下：View 调 Store，Store 调 API，API 调 Utils。反过来不行。

## 三、必须先做的 5 件事

### 1. 统一网络层（utils/request）

不管用什么技术栈（axios / fetch / alova），后台项目的请求层必须解决 4 个问题：

| 问题 | 解决思路 |
| --- | --- |
| 统一 baseURL | 环境变量 + 拦截器 |
| 自动注入 token | 请求拦截器 |
| 自动解包业务数据 | 响应拦截器：把 `{ code, data, msg }` 拆成 `data` |
| 统一错误处理 | 401 跳登录、403 提示、500 提示、网络错误提示 |

关键设计：

- 给请求层留一个**"开关"**，允许某些接口不自动解包——比如写操作需要拿后端的 `msg` 字段做成功提示
- 401 不要直接 `window.location.href = '/login'`，要调路由的 `push` 方法——这样能保留 `redirect` 参数，登录后能跳回原页面

### 2. 凭证管理（utils/auth）

把"token 怎么存、怎么取、怎么清"封装成一个对象，全项目只在这一处接触 `localStorage` / `cookie`：

```typescript
const AuthStorage = {
  getToken(),
  setToken(token, rememberMe),
  clearAuth(),
  getTenantId(),  // 多租户场景
  setTenantId(),
}
```

两个常见坑：

- **记住我的实现**：用 `sessionStorage`（关浏览器失效）还是 `localStorage`（长期保存），用单独一个 boolean 开关控制，不要混着存
- **退出登录要"一锅端"**：清 token、清用户信息、清路由、清缓存、清长连接

### 3. 用户状态（store/user）

用户 Store 是登录态的唯一来源，至少包含：

```typescript
{
  userInfo,    // 用户信息
  isLoggedIn,  // 是否已登录（读 token 判断，不读 state）
  login(),     // 调登录接口 + 存 token
  logout(),    // 调登出接口 + 清场
  getUserInfo()// 拉用户信息
}
```

核心原则：登录成功后不要立刻拉用户信息——交给路由守卫在第一次进入受保护页面时再拉，避免冷启动时多发一个请求。

### 4. 动态路由（store/permission + router/guards）

后台项目的灵魂是菜单和路由由后端下发。标准做法：

1. 用户登录 → 存 token
2. 进入首页 → 路由守卫触发
3. 调后端 `/menus` → 拿到菜单树
4. 把菜单树转换成 `vue-router` 路由
5. `router.addRoute()` 注入
6. 用 `{ ...to, replace: true }` 触发重新 match

关键设计：

- 用一个 `isRouteGenerated` 标志位防止重复拉接口
- `import.meta.glob`（Vite）或 `require.context`（Webpack）把所有页面组件提前映射成对象，运行时按路径查表
- 找不到对应组件时回退到 404 页面，不要让路由白屏

菜单数据转路由的规则要简单可解释：

| 节点字段 | 处理方式 |
| --- | --- |
| `component: "Layout"` | 顶层菜单，包一层布局 |
| `component: "user/profile"` | 加载 `views/user/profile.vue` |
| `children: [...]` | 递归处理 |

### 5. 统一页面模板（layouts）

后台系统的布局大同小异，至少做两套：左侧菜单 + 顶部菜单。可以多做一些（混合、双侧栏），但默认一套就够。

布局组件应该负责：

- 头部（Logo、用户菜单、消息、设置）
- 侧边栏（菜单，根据当前路由高亮）
- 内容区（`<router-view />` + 面包屑 + 标签页）
- 全局设置面板（主题、布局切换）

## 四、典型业务模块的标准套路

后台 80% 的页面都是列表页 + 表单页两种模式。把这两种模式抽出来，业务开发就只是填空。

### 列表页套路

```
┌─────────────────────────────────────┐
│  搜索栏  [关键字] [搜索] [重置]         │
├─────────────────────────────────────┤
│  工具栏  [+ 新增]      [刷新][全屏]    │
├─────────────────────────────────────┤
│  表格                              │
│  ┌────┬────┬────┬────┬─────────┐  │
│  │  1 │  2 │  3 │  4 │  操作    │  │
│  └────┴────┴────┴────┴─────────┘  │
├─────────────────────────────────────┤
│           < 1 2 3 >                │
└─────────────────────────────────────┘
```

抽成组合式函数 `usePageTable`：

```typescript
const { loading, list, total, params, fetchData, handleQuery, handleResetQuery } =
  usePageTable({
    initialParams: { pageNum: 1, pageSize: 10, keywords: "" },
    request: YourAPI.getPage,  // 注入数据源
  });
```

- `loading`、`list`、`total`、`params` 是响应式状态
- `fetchData` 触发请求
- `handleQuery` 回到第一页
- `handleResetQuery` 重置参数 + 重查

只管分页，不掺弹窗、勾选、表单——其他关注点通过参数注入。

### 表单页套路

三种容器选择：

| 场景 | 推荐 |
| --- | --- |
| 简单增改（2~3 个字段） | `el-dialog` 弹窗 |
| 复杂表单（4+ 字段 / 步骤表单） | `el-drawer` 抽屉 |
| 独立页面 | 单独路由 |

统一约定：

- 提一个 `initialFormData` 常量作为表单的"空白模板"
- 打开弹窗时 `Object.assign(formData, initialFormData)` 或 `Object.assign(formData, row)` 回填
- 关闭时 `formRef.value?.resetFields()` 清校验
- 提交时先用 `formRef.value?.validate()` 拦一道

## 五、权限设计的"三个维度"

后台的权限通常分三层。三层都要考虑，但实现成本不同：

### 1. 菜单权限（路由级）

最重——决定用户能看到哪些菜单和路由。后端下发菜单，前端按菜单生成路由就够了，**前端不要自己维护菜单数据**。

### 2. 按钮权限（操作级）

最常见——决定用户能不能点"删除"、"编辑"按钮。

两种实现：

- **前端隐藏**：`v-hasPerm="'sys:user:delete'"`，无权限时不渲染按钮
- **后端兜底**：接口返回 403 时拦截器统一提示"权限不足"

建议：前端只做"体验优化"（不显示用户不能用的按钮），真正的拦截放在后端。否则前端绕过 UI 就能调接口，安全失控。

**简化方案**：如果项目不大，按钮权限可以让 `v-hasPerm` 指令"放行"（不隐藏），完全靠后端兜底。这样前端不需要维护权限码列表，省一大笔维护成本。

### 3. 数据权限（行级）

最复杂——决定用户能看到哪些数据行（如"只能看自己部门的订单"）。这块强烈建议放在后端做，前端做不动也不应该做。

## 六、API 层设计规范

API 层是最容易乱的地方。三个约定可以让它始终干净。

### 1. 按业务域分目录

```
api/
  auth/        # 登录
  system/
    user/      # 用户管理
    role/      # 角色管理
    menu/      # 菜单管理
    dept/      # 部门管理
```

每个目录下一个 `index.ts`（接口方法）+ `types.ts`（类型定义）。

### 2. 类型先行

每个接口的入参和返回值都要有 TypeScript 类型。调用方写代码时编辑器能直接提示字段，不用切到浏览器看 Network。

```typescript
// types.ts
export interface UserItem {
  id: string;
  name: string;
  // ...
}

export interface UserQueryParams extends BaseQueryParams {
  keywords?: string;
}

// index.ts
const UserAPI = {
  getPage(params: UserQueryParams) {
    return request<unknown, PageResult<UserItem>>({...});
  }
};
```

### 3. 路径常量提上去

```typescript
const USER_BASE_URL = "/admin-user";
const UserAPI = {
  getById(id: string) {
    return request({ url: `${USER_BASE_URL}/${id}`, method: "get" });
  }
};
```

不要把 URL 散落在各处——以后要换路径版本前缀（`/api/v2/...`）只改一处。

## 七、几个反模式

### ❌ 反模式 1：在 View 里直接调 axios

```vue
<script setup>
// ❌ View 直接发请求
import axios from "axios";
const list = ref([]);
onMounted(async () => {
  const res = await axios.get("/api/users");
  list.value = res.data;
});
</script>
```

为什么错：请求逻辑不可复用、没类型、错误没统一处理、loading 状态要自己写。

**正确做法**：View 调 Store，Store 调 API，API 调 request。

### ❌ 反模式 2：业务状态用 provide/inject 跨组件传

```vue
<!-- ❌ 一层套一层传 props -->
<UserList @select="onUserSelect" />
<RoleDialog :selected-user="selectedUser" />
```

为什么错：组件树一变就崩，不可维护。

**正确做法**：跨组件共享的状态（用户信息、权限、字典）放 Store。父子组件传 props 即可。

### ❌ 反模式 3：把 token 存到 vuex/pinia 里

```typescript
// ❌ Store 里存 token
const userStore = defineStore("user", () => {
  const token = ref(localStorage.getItem("token"));
  // ...
});
```

为什么错：

- 浏览器刷新后状态丢失，体验差
- 多个 tab 状态不一致
- 状态层应该是派生的——`isLoggedIn` 应该从 token 算出来，不要把 token 复制到 state 里

**正确做法**：token 存 storage，Store 提供 `isLoggedIn()` 这种计算方法而不是存一个 `isLoggedIn` 字段。

### ❌ 反模式 4：路由懒加载手写 N 个 import

```typescript
// ❌ 路由多了就写不动了
const routes = [
  { path: "/user", component: () => import("@/views/user/index.vue") },
  { path: "/role", component: () => import("@/views/role/index.vue") },
  // ... 一百个
];
```

**正确做法**：`import.meta.glob("@/views/**/**.vue")` 一次性映射，运行时按路径查表。

## 八、架子的"完工清单"

一个后台架子搭好之后，至少要支持：

- 登录 / 登出 / 记住我
- 401 自动跳登录，登录后能跳回原页面
- 路由由后端下发，前端按权限渲染菜单
- 任意页面刷新后能恢复路由（动态路由重新生成）
- 列表页有搜索、分页、loading、新增/编辑/删除
- 错误有统一提示（toast / notification）
- 主题切换（明亮 / 暗黑 / 跟随系统）
- 国际化（至少中英双语）
- 响应式（PC、平板、手机至少不崩）

完成后，每个新业务模块的开发时间应该控制在 1~2 天内——这就是架子成功的标准。

## 九、总结：架子的三个关键习惯

1. **分层清晰，依赖单向**——任何一层都不能反向依赖上一层
2. **类型先行**——API 类型化、Store 类型化、Props 类型化，少写一半 bug
3. **抽出可复用的模式**——分页表格、表单弹窗、CRUD 操作，第一次写觉得麻烦，第二个模块就会感谢自己

架子是为业务服务的，不要为了"架构优雅"过度设计。能用三层解决的问题不要上六层。**保持简单，就是最好的架构。**