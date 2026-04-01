import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '小满的博客 - 前端开发者' }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: { title: '技术博客 - 小满的博客' }
    },
    {
      path: '/blog/:id',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue'),
      meta: { title: '文章 - 小满的博客' }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: { title: '作品集 - 小满的博客' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: '关于我 - 小满的博客' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '页面未找到 - 小满的博客' }
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || '小满的博客'
})

export default router
