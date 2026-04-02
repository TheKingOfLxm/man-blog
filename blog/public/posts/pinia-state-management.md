## 为什么从 Vuex 迁移到 Pinia

大三做项目的时候还在用 Vuex，那时候觉得 mutations 和 actions 的区分很烦——改个数据还得写 mutation，异步还得写 action。

后来导师推荐试试 Pinia，一试就回不去了。

## Pinia 的优势

### 1. 没有 mutations 了

```typescript
// Vuex
mutations: {
  setCount(state, val) { state.count = val }
},
actions: {
  async fetchCount({ commit }) {
    const res = await api.getCount()
    commit('setCount', res.data)
  }
}

// Pinia
actions: {
  async fetchCount() {
    const res = await api.getCount()
    this.count = res.data  // 直接改，完事
  }
}
```

### 2. 完美的 TypeScript 支持

不需要写那些繁琐的类型声明文件，Pinia 天然支持类型推导。

### 3. 更轻量

Pinia 约 1KB，API 更简洁，不需要嵌套模块。

## 我的使用模式

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const name = ref('刘小满')
  const isLoggedIn = ref(false)

  function login() { isLoggedIn.value = true }
  function logout() { isLoggedIn.value = false }

  return { name, isLoggedIn, login, logout }
})
```

Composition API 风格的 store，代码更灵活。

## 持久化方案

用 `pinia-plugin-persistedstate` 插件，一行配置搞定 localStorage 持久化。

## 踩过的坑

1. **SSR 中使用**：服务端渲染时 store 需要每个请求独立创建
2. **热更新**：开发时修改 store 定义，需要正确配置 HMR
3. **store 互相引用**：直接调用其他 store 的函数即可，不需要额外配置

## 总结

Pinia 是 Vue 官方推荐的状态管理方案，如果你还在用 Vuex，真的建议迁移。API 更简洁，开发效率明显提升。
