## 前言

用 Vue 写了大半年项目，一直好奇 `ref` 和 `reactive` 底层到底是怎么工作的。最近花了几天时间读源码 + 写 demo，总算搞明白了，记录一下。

## 核心机制：Proxy

Vue 3 的响应式基于 ES6 的 `Proxy`，取代了 Vue 2 的 `Object.defineProperty`。

```javascript
const state = reactive({ count: 0 })
// 实际上发生了这件事：
const proxy = new Proxy({ count: 0 }, {
  get(target, key) {
    track(target, key)  // 收集依赖
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    trigger(target, key)  // 触发更新
    return true
  }
})
```

## effect：响应式的引擎

每次读取响应式数据时，当前正在运行的 effect 会被收集为依赖。数据变化时，所有依赖它的 effect 会重新执行。

```javascript
watchEffect(() => {
  console.log(state.count) // 这里读取了 count，触发 track
})

state.count++ // 触发 trigger，上面的回调重新执行
```

## ref 的实现

ref 比 reactive 简单，它用一个对象包了一层，通过 `get/set` 拦截 `.value` 的读写。

```javascript
function ref(value) {
  return {
    get value() { track(this, 'value'); return value },
    set value(nv) { value = nv; trigger(this, 'value') }
  }
}
```

## computed 的秘密

computed 本质上是一个带缓存的 effect。只有依赖变了才重新计算，否则直接返回缓存值。

## 实际开发中的体会

理解了原理之后，下面这些问题就迎刃而解了：

- 为什么解构 reactive 对象会丢失响应性？→ 因为拿到的不再是 Proxy
- 为什么 ref 要 `.value` 而 reactive 不用？→ ref 靠 getter/setter，reactive 靠 Proxy
- computed 什么时候缓存失效？→ 依赖的响应式数据变化时

## 总结

Vue 3 的响应式系统设计得很精巧。不需要背原理，动手写一个简易版 \\(50 行代码就够了\\)，理解会比看十篇文章都深。
