## 背景

做毕设的时候，首页有一堆动画效果——卡片渐入、数字滚动、进度条加载。在自己电脑上跑得很流畅，但在室友的老电脑上直接卡成 PPT。

这才意识到 CSS 动画不只是写 `transition` 和 `animation`，性能也是一门学问。

## 浏览器的渲染流程

1. **JavaScript** → 触发样式变化
2. **Style** → 计算最终样式
3. **Layout** → 计算元素位置和大小
4. **Paint** → 绘制像素
5. **Composite** → 合成图层

性能优化的核心：**让动画只触发 Composite，跳过 Layout 和 Paint。**

## 哪些属性触发 Composite

- `transform`（translate、scale、rotate）
- `opacity`

这两个属性由 GPU 直接处理，不会引起重排重绘。

## 优化实践

### 1. 用 transform 替代 top/left

```css
/* 差：触发 Layout */
.move { transition: left 0.3s; }
.move:hover { left: 100px; }

/* 好：只触发 Composite */
.move { transition: transform 0.3s; }
.move:hover { transform: translateX(100px); }
```

### 2. will-change 提示浏览器

```css
.card:hover {
  will-change: transform;
  transform: translateY(-4px);
}
```

### 3. 避免同时动画太多元素

超过 10 个元素同时做复杂动画，低端设备就会吃力。

## 总结

动画性能优化的关键是理解浏览器渲染管线。记住：**能用 transform 和 opacity 解决的动画，就别碰其他属性。**
