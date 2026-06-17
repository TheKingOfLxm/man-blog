<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import site from '../data/site.json'

const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)
useSeo({
  title: '关于 - 小满的技术随笔',
  description: '关于这个博客：记录 Vue、CSS、工程化等前端实践，博主亦好旧体诗。'
})

const skills = [
  { name: 'Vue 3', level: 90 },
  { name: 'JavaScript', level: 88 },
  { name: 'CSS / HTML', level: 85 },
  { name: 'TypeScript', level: 72 },
  { name: 'Vite / 工程化', level: 78 },
  { name: 'Git', level: 80 }
]
</script>

<template>
  <div class="about container" ref="rootRef">
    <header class="page-head reveal">
      <span class="kicker">About</span>
      <h1>关于</h1>
    </header>

    <section class="block reveal">
      <h2 class="block-title">关于这个博客</h2>
      <div class="prose">
        <p>这里是 <strong>{{ site.author }}</strong> 的技术随笔。我用它记录前端开发中的思考、踩过的坑与一些避坑心得——主要是 Vue 生态、CSS 与工程化的实践。</p>
        <p>比起博闻强识，我更相信把一件小事讲清楚。所以这里的文章，多是某一个具体问题的来龙去脉，而非面面俱到的清单。</p>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">写什么</h2>
      <div class="topics">
        <span v-for="t in site.topics" :key="t" class="topic">{{ t }}</span>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">技术栈</h2>
      <div class="skills">
        <div v-for="s in skills" :key="s.name" class="skill">
          <div class="skill-head"><span>{{ s.name }}</span><span class="pct">{{ s.level }}%</span></div>
          <div class="bar"><div class="fill" :style="{ width: s.level + '%' }"></div></div>
        </div>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">兼好旧体诗</h2>
      <div class="prose">
        <p>代码之外，我也写一点旧体诗词。以为敲键如推敲，字字皆平仄——技术求精确，文字求余味，二者于我皆是癖好。</p>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">联系</h2>
      <div class="contacts">
        <a :href="site.social.github" target="_blank" rel="noopener" class="contact">GitHub ↗</a>
        <a :href="`mailto:${site.social.email}`" class="contact">{{ site.social.email }}</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head { text-align: center; margin-bottom: 44px; }
.page-head h1 { font-size: clamp(28px, 5vw, 40px); margin-top: 10px; }
.block { max-width: var(--reading-width); margin: 0 auto 52px; }
.block-title {
  font-size: 16px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.prose { font-size: 15.5px; line-height: 1.85; color: var(--text-body); }
.prose p { margin-bottom: 14px; }
.prose strong { color: var(--ink); }
.topics { display: flex; gap: 10px; flex-wrap: wrap; }
.topic {
  padding: 6px 14px;
  font-size: 13.5px;
  color: var(--text-body);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.skills { display: flex; flex-direction: column; gap: 18px; }
.skill-head {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 7px;
  color: var(--ink);
}
.pct { color: var(--accent); font-weight: 600; font-family: var(--font-mono); font-size: 13px; }
.bar { height: 6px; background: var(--bg-surface-alt); border-radius: 3px; overflow: hidden; }
.fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.8s ease; }
.contacts { display: flex; gap: 24px; flex-wrap: wrap; }
.contact {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.contact:hover { color: var(--accent); }
</style>
