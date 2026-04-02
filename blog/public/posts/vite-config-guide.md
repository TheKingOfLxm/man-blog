## 为什么整理这份配置

每次建新项目都要翻以前的 `vite.config.ts`，干脆整理一份常用配置清单，也方便其他同学参考。

## 路径别名

```typescript
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

tsconfig 也要同步配置，否则 IDE 会报错。

## 开发服务器代理

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}
```

前后端联调必备。

## 环境变量

```
# .env.development
VITE_API_BASE=http://localhost:3000

# .env.production
VITE_API_BASE=https://api.example.com
```

代码中用 `import.meta.env.VITE_API_BASE` 读取。

## 构建优化

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vue: ['vue', 'vue-router', 'pinia'],
        markdown: ['markdown-it', 'highlight.js']
      }
    }
  },
  chunkSizeWarningLimit: 1000
}
```

把大的依赖拆成独立 chunk，利用浏览器缓存。

## 总结

Vite 的配置项不算多，但每个都挺实用。建议建一个自己的配置模板，以后新项目直接复制。
