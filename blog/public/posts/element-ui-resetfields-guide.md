## 前言

用 Element UI 写表单，`resetFields()` 这个 API 大概是 90% 的人都会踩坑的地方。今天彻底搞清楚它的原理和正确用法。

## 核心结论（必背）

**`resetFields()` 不是清空表单！**

`resetFields()` = 重置为表单首次挂载时的初始值

## 官方定义

> resetFields()
> 对整个表单进行重置，将所有字段值重置为初始值，并移除校验结果。

✅ **初始值 = 表单挂载（created/mounted）那一刻的值**

## 常见踩坑场景

编辑页回显数据后调用 reset：

```javascript
// 1. 页面刚进来，form 是空的
data() {
  return {
    form: { name: '', age: '' }
  }
}

// 2. 接口请求后赋值（编辑回显）
this.form = { name: "张三", age: 20 }

// 3. 调用 resetFields()
this.$refs.form.resetFields()
```

**结果：**

✅ 回到初始空值
❌ 不是保留 "张三 / 20"
❌ 不是清空（只是回到最初状态）

## 一句话记忆

> **页面刚加载时表单是什么值，reset 就回到什么值。**
> 后面赋值、修改、回显，都不影响 reset 的目标。

## 想真正「清空表单」？用这两种方法

### 方法 1：手动赋空值（最简单）

```javascript
this.form = {
  name: '',
  age: ''
}
```

### 方法 2：恢复到 data 原始值（推荐）

```javascript
Object.assign(this.form, this.$options.data().form)
```

## 总结

- `resetFields()` = 恢复首次挂载值
- 手动赋值空 = 真正清空表单
- **编辑页必用手动清空，不要依赖 reset**
