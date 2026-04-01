<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()

const skills = [
  { name: 'Vue 3', level: 90 },
  { name: 'JavaScript', level: 88 },
  { name: 'CSS / HTML', level: 85 },
  { name: 'TypeScript', level: 72 },
  { name: 'Vite / 工程化', level: 78 },
  { name: 'Git', level: 80 }
]

const timeline = [
  { year: '2026.03', title: '大四下', desc: '完成毕业设计，搭建个人博客，沉淀技术文章' },
  { year: '2025.09', title: '大四上', desc: '秋招求职，深入 Vue 3 全家桶，独立完成多个练手项目' },
  { year: '2025.03', title: '大三下', desc: '系统学习 TypeScript、Pinia 状态管理，探索 Vite 工程化' },
  { year: '2024.09', title: '大三上', desc: '从 Vue 2 升级到 Vue 3 Composition API，理解响应式原理' },
  { year: '2024.03', title: '大二下', desc: '正式学习 Vue 框架，写出第一个完整的单页应用' },
  { year: '2023.09', title: '大二上', desc: '在中南民族大学开始自学 HTML/CSS/JS，迈入前端世界' }
]

const contacts = [
  { icon: 'GitHub', label: 'GitHub', href: 'https://github.com/TheKingOfLxm' },
  { icon: 'Email', label: '邮箱', href: 'mailto:2083272571@qq.com' }
]
</script>

<template>
  <div class="about-page">
    <div class="container">
      <section class="about-header">
        <h1 class="reveal">关于我</h1>
        <p class="subtitle reveal">中南民族大学 · 计算机科学 · 大四在读</p>
      </section>

      <!-- 个人简介 -->
      <section class="about-section reveal">
        <div class="glass about-intro">
          <div class="about-avatar">🏔️</div>
          <div class="about-text">
            <p>
              你好，我是刘小满，中南民族大学大四学生。从大二开始自学前端开发，两年间从零基础到能独立完成项目，踩过不少坑，也积累了不少经验。
            </p>
            <p>
              我的主攻方向是 Vue 生态——Vue 3、Composition API、Pinia、Vue Router、Vite 这一套。
              写代码的时候我喜欢把细节打磨到位，一个过渡动画调半小时也不觉得烦。
            </p>
            <p>
              目前在写毕业设计的同时维护这个博客，记录学习过程中的思考和心得。如果你对我的经历感兴趣，欢迎联系我！
            </p>
          </div>
        </div>
      </section>

      <!-- 技能 -->
      <section class="about-section reveal">
        <h2 class="section-label">技能水平</h2>
        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.name" class="skill-item glass">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 时间线 -->
      <section class="about-section reveal">
        <h2 class="section-label">学习历程</h2>
        <div class="timeline">
          <div v-for="(item, index) in timeline" :key="index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content glass">
              <span class="timeline-year">{{ item.year }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="about-section reveal">
        <h2 class="section-label">联系我</h2>
        <div class="contact-grid">
          <a
            v-for="contact in contacts"
            :key="contact.icon"
            :href="contact.href"
            target="_blank"
            class="contact-card glass glass-hover"
          >
            <span class="contact-icon">{{ contact.icon === 'GitHub' ? '🐙' : '📧' }}</span>
            <span class="contact-label">{{ contact.label }}</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
  min-height: 100vh;
}

.about-header {
  text-align: center;
  margin-bottom: 48px;
}

.about-header h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-muted);
}

.about-section {
  max-width: 800px;
  margin: 0 auto 60px;
}

.section-label {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-heading);
}

/* 简介 */
.about-intro {
  display: flex;
  gap: 32px;
  padding: 32px;
  align-items: flex-start;
}

.about-avatar {
  font-size: 72px;
  flex-shrink: 0;
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: 14px;
  line-height: 1.8;
}

/* 技能 */
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  padding: 16px 20px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.skill-name {
  font-weight: 600;
  color: var(--text-heading);
}

.skill-level {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 14px;
}

.skill-bar {
  height: 8px;
  background: var(--color-primary-light);
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
  border-radius: 4px;
  transition: width 1s ease;
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--bg-primary);
}

.timeline-content {
  padding: 20px;
}

.timeline-year {
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 600;
}

.timeline-content h3 {
  font-size: 18px;
  margin: 6px 0;
}

.timeline-content p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* 联系方式 */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.contact-icon {
  font-size: 32px;
}

.contact-label {
  font-weight: 600;
  color: var(--text-heading);
}

@media (max-width: 768px) {
  .about-intro {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .about-avatar {
    font-size: 56px;
  }
}
</style>
