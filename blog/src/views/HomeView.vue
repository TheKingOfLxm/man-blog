<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from 'vue'
import gsap from 'gsap'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import postsData from '../data/posts.json'
import projectsData from '../data/projects.json'
import site from '../data/site.json'
import PostCard from '../components/PostCard.vue'
import ProjectCard from '../components/ProjectCard.vue'
import AppIcon from '../components/AppIcon.vue'
import type { Post, Project } from '../types'
const HeroScene = defineAsyncComponent(
  () => import('../components/HeroScene.vue'),
)
const posts = [...(postsData as Post[])].sort((a, b) =>
  b.date.localeCompare(a.date),
)
const featured = computed(() => posts.find((p) => p.featured) ?? posts[0]!)
const recent = computed(() =>
  posts.filter((p) => p.id !== featured.value.id).slice(0, 3),
)
const projects = (projectsData as Project[]).slice(0, 2)
const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)
let media: gsap.MatchMedia | undefined
onMounted(() => {
  media = gsap.matchMedia()
  media.add(
    '(prefers-reduced-motion: no-preference)',
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-kicker', { y: 15, opacity: 0, duration: 0.7 })
        .from(
          '.hero-title .word',
          { yPercent: 110, rotate: 3, duration: 1.15, stagger: 0.13 },
          '-=.45',
        )
        .from(
          '.hero-description, .hero-actions, .hero-note',
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
          '-=.7',
        )
        .from('.hero-art', { opacity: 0, scale: 0.87, duration: 1.4 }, '-=1.3')
      gsap.to('.hero-art', {
        y: 55,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      gsap.to('.ticker-track', {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ticker',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    },
    rootRef.value!,
  )
})
onUnmounted(() => media?.revert())
useSeo({
  title: '小满 · 以代码探索无限可能',
  description:
    '刘小满的个人创作空间。记录前端开发、设计与生活，让灵感在代码中发生。',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '小满的技术随笔',
    author: { '@type': 'Person', name: '刘小满' },
  },
})
</script>
<template>
  <div class="home" ref="rootRef">
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="hero-kicker">
          <span class="status-dot"></span><span>HELLO WORLD, I'M XIAOMAN</span
          ><span class="hero-edition">EST. 2026</span>
        </div>
        <h1 id="hero-title" class="hero-title">
          <span class="word-wrap"><span class="word">Code. Create.</span></span
          ><span class="word-wrap"
            ><em class="word">Beyond<span class="period">.</span></em></span
          >
        </h1>
        <div class="hero-description">
          <h2>以代码为笔，探索无限可能。</h2>
          <p>
            你好，我是刘小满，一名前端开发者。<br />在这里，记录技术的深度、设计的温度，以及生活的灵感。
          </p>
        </div>
        <div class="hero-actions">
          <router-link to="/blog" class="btn btn-primary"
            >探索文章 <AppIcon name="diagonal" :size="17" /></router-link
          ><router-link to="/about" class="about-link"
            >认识一下 <span><AppIcon name="arrow" :size="16" /></span
          ></router-link>
        </div>
        <div class="hero-note">
          <span>⌁</span> 始终好奇，永远在路上。<span class="note-rule"></span
          ><span class="note-en">ALWAYS A WORK IN PROGRESS</span>
        </div>
      </div>
      <div class="hero-art"><HeroScene /></div>
      <a href="#journal" class="scroll-cue"
        ><span class="scroll-icon"><AppIcon name="down" :size="14" /></span>
        SCROLL TO DISCOVER
        <span class="scroll-coordinate">30.59° N / 114.30° E</span></a
      >
    </section>
    <div class="ticker" aria-label="关注前端开发、创意编码、设计与生活">
      <div class="ticker-track" aria-hidden="true">
        <template v-for="n in 4" :key="n"
          ><span>FRONTEND DEVELOPMENT</span><b>✳</b><span>CREATIVE CODING</span
          ><b>✳</b><span class="outline-text">DESIGN & LIFE</span><b>✳</b
          ><span>NEVER STOP EXPLORING</span><b>✳</b></template
        >
      </div>
    </div>
    <div class="container">
      <section id="journal" aria-labelledby="journal-title">
        <div class="section-label reveal">
          <span class="num">01 / JOURNAL</span>
          <h2 id="journal-title">思考与记录<span class="title-dot">.</span></h2>
          <router-link to="/blog" class="more"
            >全部文章 <AppIcon name="diagonal" :size="14"
          /></router-link>
        </div>
        <router-link :to="`/blog/${featured.id}`" class="featured reveal">
          <div class="featured-visual" aria-hidden="true">
            <div class="feature-grid"></div>
            <div class="architecture">
              <div class="arch-layer layer-1"><span>EXPERIENCE</span></div>
              <div class="arch-layer layer-2"><span>LOGIC</span></div>
              <div class="arch-layer layer-3"><span>FOUNDATION</span></div>
            </div>
            <div class="visual-label">
              <span>ENGINEERING NOTES</span><span>↗ 001</span>
            </div>
            <span class="visual-plus">+</span>
          </div>
          <div class="featured-copy">
            <div class="featured-top">
              <span class="featured-badge"><span></span> 编辑精选</span
              ><span class="kicker">{{ featured.category }} / ENGINEERING</span>
            </div>
            <h3>{{ featured.title }}</h3>
            <p>{{ featured.summary }}</p>
            <div class="featured-bottom">
              <span
                >{{ featured.date.replaceAll('-', '.')
                }}<span class="meta-slash">/</span
                >{{ featured.readingTime }} MIN READ</span
              ><span class="read-story"
                >阅读全文 <AppIcon name="diagonal" :size="16"
              /></span>
            </div>
          </div>
        </router-link>
        <div class="recent-grid">
          <PostCard
            v-for="(post, i) in recent"
            :key="post.id"
            :post="post"
            :index="i"
          />
        </div>
      </section>
      <section aria-labelledby="projects-title">
        <div class="section-label reveal">
          <span class="num">02 / SELECTED WORKS</span>
          <h2 id="projects-title">
            想法，成为现实<span class="title-dot">.</span>
          </h2>
          <router-link to="/projects" class="more"
            >全部作品 <AppIcon name="diagonal" :size="14"
          /></router-link>
        </div>
        <div class="projects-grid">
          <ProjectCard
            v-for="(project, index) in projects"
            :key="project.id"
            :project="project"
            :index="index"
          />
        </div>
      </section>
      <section class="contact-section reveal">
        <div>
          <span class="kicker">GOOD THINGS START WITH A CONVERSATION</span>
          <h2>下一个灵感，<br />或许从一次<span>对话</span>开始。</h2>
          <p>关于技术、创意，或者只是打个招呼。</p>
        </div>
        <a
          :href="`mailto:${site.social.email}`"
          class="contact-orbit"
          aria-label="给刘小满发送邮件"
          ><AppIcon name="diagonal" :size="40" /><span>LET'S TALK</span></a
        ><span class="contact-watermark" aria-hidden="true">say hello.</span>
      </section>
    </div>
  </div>
</template>
<style scoped>
.home {
  padding-top: var(--nav-height);
  overflow: clip;
}
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.12fr 1fr;
  align-items: center;
  min-height: 660px;
  padding-top: 48px;
  padding-bottom: 85px;
}
.hero-copy {
  min-width: 0;
  position: relative;
  z-index: 2;
}
.hero-kicker {
  display: flex;
  align-items: center;
  gap: 9px;
  font: 9px var(--font-mono);
  letter-spacing: 0.09em;
  margin-bottom: 29px;
  color: var(--text-body);
}
.status-dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 12px #c2f87c55;
}
.hero-edition {
  margin-left: 25px;
  color: var(--text-faint);
  font-size: 8px;
}
.hero-title {
  font-size: clamp(58px, 6.9vw, 99px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.075em;
  white-space: nowrap;
}
.word-wrap {
  display: block;
  overflow: hidden;
  padding-bottom: 9px;
}
.word {
  display: inline-block;
}
.hero-title em {
  font-family: var(--font-serif-cn);
  font-size: 1.32em;
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 0.95;
  color: var(--accent);
  padding-right: 12px;
}
.period {
  color: var(--ink);
}
.hero-description {
  margin-top: 26px;
}
.hero-description h2 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-bottom: 13px;
}
.hero-description p {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 2;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 29px;
  margin-top: 29px;
}
.about-link {
  color: var(--ink);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 13px;
}
.about-link > span {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  border: 1px solid var(--border);
  border-radius: 50%;
  transition: translate 0.2s;
}
.about-link:hover > span {
  translate: 5px;
}
.hero-note {
  margin-top: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 9px;
}
.hero-note > span:first-child {
  font-size: 21px;
  color: var(--accent);
}
.note-rule {
  width: 25px;
  height: 1px;
  background: var(--border);
  margin: 0 4px;
}
.note-en {
  font: 7px var(--font-mono);
  letter-spacing: 0.03em;
}
.hero-art {
  height: 520px;
  width: 113%;
  margin-left: -6%;
}
.scroll-cue {
  position: absolute;
  bottom: 22px;
  left: 56px;
  right: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font: 8px var(--font-mono);
  letter-spacing: 0.1em;
}
.scroll-icon {
  width: 27px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 15px;
  display: grid;
  place-items: center;
}
.scroll-coordinate {
  margin-left: auto;
  font-size: 8px;
  color: var(--text-faint);
}
.ticker {
  border-block: 1px solid var(--border);
  overflow: hidden;
  padding: 19px 0;
  background: color-mix(in srgb, var(--bg-surface) 45%, transparent);
}
.ticker-track {
  display: flex;
  width: max-content;
  align-items: center;
  gap: 35px;
  white-space: nowrap;
  padding-left: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text-body);
}
.ticker-track b {
  font-size: 22px;
  font-weight: 400;
  color: var(--accent);
}
.outline-text {
  color: var(--text-muted);
}
.title-dot {
  color: var(--accent);
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.featured {
  display: grid;
  grid-template-columns: 0.87fr 1fr;
  min-height: 294px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  color: inherit;
  background: var(--bg-surface);
  transition: border-color 0.3s;
}
.featured:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}
.featured-copy {
  display: flex;
  flex-direction: column;
  padding: 32px 36px;
}
.featured-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.featured-badge {
  font-size: 10px;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 6px;
}
.featured-badge > span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}
.featured-top .kicker {
  color: var(--text-faint);
  font-size: 8px;
}
.featured h3 {
  font-size: 26px;
  line-height: 1.6;
  font-weight: 500;
  margin-block: 20px 12px;
  max-width: 460px;
}
.featured-copy > p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.95;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.featured-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-top: 25px;
  margin-top: auto;
  font: 9px var(--font-mono);
  color: var(--text-muted);
}
.meta-slash {
  margin-inline: 12px;
  color: var(--text-faint);
}
.read-story {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
  font: 11px var(--font-sans);
}
.featured-visual {
  position: relative;
  min-height: 290px;
  background:
    radial-gradient(ellipse at 50% 40%, #c2f87c18, transparent 65%), #1b2118;
  overflow: hidden;
}
.feature-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(#c2f87c09 1px, transparent 1px),
    linear-gradient(90deg, #c2f87c09 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse, #000, transparent 80%);
}
.architecture {
  width: 180px;
  height: 180px;
  position: absolute;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  perspective: 600px;
}
.arch-layer {
  width: 170px;
  height: 150px;
  border: 1px solid #c2f87c88;
  background: linear-gradient(135deg, #c2f87c22, #98b06804);
  position: absolute;
  left: 0;
  border-radius: 14px;
  transform: rotateX(55deg) rotateZ(-35deg);
  box-shadow:
    0 15px 30px #0003,
    inset 0 0 25px #c2f87c08;
  backdrop-filter: blur(2px);
  transition: translate 0.7s;
}
.arch-layer span {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font: 8px var(--font-mono);
  color: #b6d696;
}
.layer-1 {
  top: -28px;
  z-index: 3;
  background: linear-gradient(135deg, #8eae6260, #5b753425);
}
.layer-2 {
  top: 19px;
  z-index: 2;
}
.layer-3 {
  top: 66px;
  z-index: 1;
}
.featured:hover .layer-1 {
  translate: 0 -9px;
}
.featured:hover .layer-3 {
  translate: 0 9px;
}
.visual-label {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 20px;
  display: flex;
  justify-content: space-between;
  font: 8px var(--font-mono);
  letter-spacing: 0.08em;
  color: #89977c;
}
.visual-plus {
  position: absolute;
  top: 18px;
  left: 22px;
  color: #a9c68b;
  font: 17px var(--font-mono);
}
.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 20px;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}
.contact-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 100px;
  padding: 57px 0 86px;
  border-top: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}
.contact-section .kicker {
  font-size: 8px;
  color: var(--text-muted);
}
.contact-section h2 {
  font-size: clamp(27px, 3.4vw, 43px);
  line-height: 1.6;
  font-weight: 500;
  margin-block: 20px 15px;
  letter-spacing: -0.03em;
}
.contact-section h2 span {
  color: var(--accent);
}
.contact-section p {
  color: var(--text-muted);
  font-size: 12px;
}
.contact-orbit {
  width: 122px;
  height: 122px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-right: 55px;
  transition:
    background 0.3s,
    color 0.3s,
    rotate 0.3s;
  z-index: 1;
}
.contact-orbit span {
  font: 8px var(--font-mono);
  letter-spacing: 0.1em;
}
.contact-orbit:hover {
  background: var(--accent);
  color: var(--on-accent);
  rotate: -8deg;
}
.contact-watermark {
  position: absolute;
  right: 0;
  bottom: -56px;
  color: color-mix(in srgb, var(--text-faint) 9%, transparent);
  font: italic 150px var(--font-serif-cn);
  white-space: nowrap;
  pointer-events: none;
}
@media (min-width: 1440px) {
  .hero {
    min-height: 710px;
  }
  .hero-title {
    font-size: 102px;
  }
}
@media (max-width: 1100px) {
  .hero-title {
    font-size: 7vw;
  }
  .hero-edition {
    display: none;
  }
  .hero-art {
    width: 112%;
  }
  .featured-copy {
    padding: 26px;
  }
  .featured h3 {
    font-size: 23px;
  }
  .featured-top .kicker {
    font-size: 7px;
  }
}
@media (max-width: 1000px) {
  .hero-art {
    height: 440px;
  }
  .hero {
    min-height: 610px;
  }
  .scroll-cue {
    left: 32px;
    right: 32px;
  }
  .note-en,
  .note-rule {
    display: none;
  }
  .recent-grid {
    gap: 12px;
  }
  .recent-grid :deep(.post-card) {
    padding: 20px;
  }
}
@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 43px;
    padding-bottom: 67px;
    gap: 0;
  }
  .hero-title {
    font-size: clamp(53px, 11.2vw, 83px);
  }
  .hero-copy {
    z-index: 1;
  }
  .hero-kicker {
    font-size: 8px;
    margin-bottom: 26px;
  }
  .hero-description h2 {
    font-size: 18px;
  }
  .hero-description p {
    font-size: 11px;
  }
  .hero-note {
    margin-top: 24px;
  }
  .hero-art {
    width: 100%;
    height: 360px;
    margin: -6px 0 -8px;
  }
  .scroll-cue {
    left: 22px;
    right: 22px;
    bottom: 15px;
  }
  .ticker {
    padding: 13px 0;
  }
  .ticker-track {
    font-size: 11px;
    gap: 22px;
  }
  .featured {
    grid-template-columns: 1fr;
  }
  .featured-visual {
    min-height: 240px;
  }
  .featured-copy {
    padding: 25px;
  }
  .featured h3 {
    font-size: 23px;
  }
  .recent-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .contact-section {
    margin-top: 58px;
    padding: 40px 0 60px;
  }
  .contact-orbit {
    width: 78px;
    height: 78px;
    margin: 0 0 0 16px;
    flex-shrink: 0;
  }
  .contact-orbit svg {
    width: 25px;
  }
  .contact-orbit span {
    font-size: 6px;
  }
  .contact-watermark {
    font-size: 100px;
    bottom: -30px;
  }
  .contact-section h2 {
    font-size: 25px;
  }
  .contact-section .kicker {
    font-size: 6px;
  }
  .contact-section p {
    font-size: 10px;
  }
  .section-label {
    flex-wrap: wrap;
  }
  .section-label .num {
    width: 100%;
  }
}
@media (max-width: 360px) {
  .hero-title {
    font-size: 46px;
  }
  .featured-bottom {
    gap: 8px;
    font-size: 8px;
  }
}
</style>
