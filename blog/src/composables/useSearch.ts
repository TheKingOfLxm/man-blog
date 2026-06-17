import { computed, type Ref } from 'vue'
import type { Post } from '../types'

/** 纯函数：按 标题/摘要/标签 过滤文章（大小写不敏感）。 */
export function filterPosts(posts: Post[], query: string): Post[] {
  const q = query.trim().toLowerCase()
  if (!q) return posts
  return posts.filter((p) => {
    const hay = [p.title, p.summary, p.tags.join(' ')].join(' ').toLowerCase()
    return hay.includes(q)
  })
}

/** 响应式封装：输入 posts 与 query(Ref<string>)，返回过滤结果。 */
export function useSearch(posts: Post[], query: Ref<string>) {
  return computed(() => filterPosts(posts, query.value))
}
