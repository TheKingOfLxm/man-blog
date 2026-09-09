<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import site from '../data/site.json'
import AppIcon from '../components/AppIcon.vue'
const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)
useSeo({
  title: '关于 - 小满的技术随笔',
  description: '认识刘小满：用代码创造，在记录中成长。',
})
const skills = [
  { name: 'Vue 3', label: '把界面拆解成有生命力的组件', mark: 'V' },
  { name: 'TypeScript', label: '让每一次重构都更有底气', mark: 'TS' },
  { name: 'CSS & Motion', label: '细节里的秩序，交互里的温度', mark: '✳' },
  { name: 'Vite & Git', label: '让想法更快地成为作品', mark: '↗' },
]
</script>
<template>
  <div class="about container" ref="rootRef">
    <header class="page-head reveal">
      <span class="kicker">THE PERSON BEHIND THE PIXELS</span>
      <h1>你好，我是<span>刘小满。</span></h1>
      <p>一名前端开发者，也是一个持续探索的人。</p>
    </header>
    <div class="about-layout">
      <div class="about-story">
        <section class="block reveal">
          <span class="eyebrow">01 / A LITTLE ABOUT ME</span>
          <h2>用代码创造，<br />在记录中成长。</h2>
          <p>
            这里是我的技术随笔。我用它记录前端开发中的思考、踩过的坑与一些避坑心得——主要是
            Vue 生态、CSS 与工程化的实践。
          </p>
          <p>
            比起博闻强识，我更相信把一件小事讲清楚。所以这里的文章，多是某一个具体问题的来龙去脉，而非面面俱到的清单。
          </p>
          <div class="topics">
            <router-link
              v-for="topic in site.topics"
              :key="topic"
              :to="{
                path: '/blog',
                query: topic === 'Vue 3' ? { tag: topic } : { cat: topic },
              }"
              >{{ topic }} ↗</router-link
            >
          </div>
        </section>
        <section class="block reveal">
          <span class="eyebrow">02 / MY TOOLBOX</span>
          <div class="skills">
            <div v-for="skill in skills" :key="skill.name" class="skill">
              <span class="skill-mark">{{ skill.mark }}</span>
              <div>
                <h3>{{ skill.name }}</h3>
                <p>{{ skill.label }}</p>
              </div>
              <AppIcon name="diagonal" :size="15" />
            </div>
          </div>
        </section>
      </div>
      <aside class="about-aside reveal">
        <span class="aside-star" aria-hidden="true">✳</span
        ><span class="kicker">A NOTE TO SELF</span>
        <blockquote>保持好奇。<br />认真生活。<br />持续创造。</blockquote>
        <p>STAY CURIOUS.<br />KEEP BUILDING.</p>
        <div class="aside-contact">
          <a
            :href="site.social.github"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub <AppIcon name="diagonal" :size="15" /></a
          ><a :href="`mailto:${site.social.email}`"
            >打个招呼 <AppIcon name="mail" :size="15"
          /></a>
        </div>
      </aside>
    </div>
  </div>
</template>
<style scoped>
.about {
  padding-top: calc(var(--nav-height) + 35px);
  padding-bottom: 90px;
}
.page-head h1 span {
  color: var(--accent);
}
.page-head > p {
  color: var(--text-muted);
  font-size: 14px;
}
.about-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 100px;
  padding-top: 28px;
}
.block {
  margin-bottom: 55px;
}
.block h2 {
  font-size: 34px;
  line-height: 1.6;
  font-weight: 500;
  margin: 22px 0;
}
.block > p {
  font-size: 14px;
  line-height: 2.1;
  margin-bottom: 18px;
}
.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}
.topics a {
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 6px 15px;
  font-size: 11px;
  color: var(--text-body);
}
.topics a:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.skills {
  margin-top: 22px;
}
.skill {
  display: flex;
  align-items: center;
  gap: 20px;
  border-top: 1px solid var(--border);
  padding: 20px 0;
}
.skill-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 16px;
  color: var(--accent);
}
.skill h3 {
  font-size: 17px;
}
.skill p {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
}
.skill > svg {
  margin-left: auto;
}
.about-aside {
  align-self: start;
  position: sticky;
  top: 120px;
  background: linear-gradient(135deg, var(--bg-surface-alt), var(--bg-surface));
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 36px;
}
.aside-star {
  display: block;
  color: var(--accent);
  font-size: 83px;
  line-height: 1;
  margin-bottom: 40px;
}
.about-aside .kicker {
  font-size: 8px;
  color: var(--text-muted);
}
.about-aside blockquote {
  color: var(--ink);
  font-size: 27px;
  line-height: 1.75;
  margin: 20px 0;
}
.about-aside > p {
  color: var(--text-muted);
  font: 9px/1.8 var(--font-mono);
  letter-spacing: 0.1em;
}
.aside-contact {
  border-top: 1px solid var(--border);
  padding-top: 23px;
  margin-top: 36px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}
.aside-contact a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-body);
  font-size: 11px;
}
@media (max-width: 900px) {
  .about-layout {
    gap: 40px;
  }
  .about-aside {
    padding: 25px;
  }
}
@media (max-width: 640px) {
  .about-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .block h2 {
    font-size: 28px;
  }
  .about-aside {
    position: static;
  }
  .block > p {
    font-size: 13px;
  }
  .page-head h1 span {
    display: block;
  }
}
</style>
