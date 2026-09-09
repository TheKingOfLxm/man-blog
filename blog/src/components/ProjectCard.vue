<script setup lang="ts">
import type { Project } from '../types'
import AppIcon from './AppIcon.vue'
defineProps<{ project: Project }>()
</script>
<template>
  <article class="project-card reveal">
    <div class="project-visual" :class="project.id" aria-hidden="true">
      <div class="project-visual-grid"></div>
      <span class="visual-caption"
        >INTERFACE EXPLORATION /
        {{
          project.id === 'personal-blog'
            ? '001'
            : project.id === 'todo-app'
              ? '002'
              : project.id === 'weather-app'
                ? '003'
                : '004'
        }}</span
      >
      <div
        v-if="project.id === 'personal-blog'"
        class="mini-browser blog-preview"
      >
        <div class="mini-toolbar">
          <span>✳ 小满.</span><span>Journal &nbsp; Works &nbsp; About</span>
        </div>
        <div class="mini-hero">
          <div>
            <small>A DEVELOPER'S JOURNAL</small
            ><b>Code. Create.<br /><em>Beyond.</em></b
            ><span class="mini-button">Explore the journal ↗</span>
          </div>
          <div class="mini-knot">✳</div>
        </div>
        <div class="mini-cards"><i></i><i></i><i></i></div>
      </div>
      <div
        v-else-if="project.id === 'todo-app'"
        class="mini-browser todo-preview"
      >
        <div class="todo-sidebar">
          ◈<span>⌂</span><span>▤</span><span>◷</span>
        </div>
        <div class="todo-content">
          <small>MAKE ROOM FOR WHAT MATTERS</small
          ><b>A little more focused<span>Today, with intention.</span></b>
          <div class="todo-row">
            <i class="done">✓</i><span>给灵感留一点空间</span
            ><small>PERSONAL</small>
          </div>
          <div class="todo-row">
            <i></i><span>把想法变成下一步</span><small>WORK</small>
          </div>
          <div class="todo-row">
            <i></i><span>完成一个小小的创造</span><small>CREATE</small>
          </div>
        </div>
      </div>
      <div
        v-else-if="project.id === 'weather-app'"
        class="utility-preview weather-preview"
      >
        <span>WUHAN / 武汉</span><b>24<span>°</span></b>
        <p>晴朗，适合出门走走。<span>☀</span></p>
        <div>体感 25° <span>湿度 62%</span></div>
      </div>
      <div v-else class="utility-preview editor-preview">
        <span>untitled.md <i>MARKDOWN</i></span
        ><b><em>#</em> Ideas start here.</b>
        <p><em>##</em> 把灵感写下来</p>
        <p>每一次记录，都是下一次创造的开始。</p>
        <div><em>const</em> inspiration = <strong>'everywhere'</strong></div>
      </div>
    </div>
    <div class="project-body">
      <div class="project-title-row">
        <h3>{{ project.title }}</h3>
        <AppIcon name="diagonal" />
      </div>
      <p>{{ project.description }}</p>
      <div class="project-bottom">
        <div class="project-tags">
          <span v-for="tag in project.tags.slice(0, 3)" :key="tag">{{
            tag
          }}</span>
        </div>
        <div class="project-links">
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`查看${project.title}演示`"
            >体验 <AppIcon name="diagonal" :size="13" /></a
          ><a
            v-if="project.source"
            :href="project.source"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`查看${project.title}源码`"
            >源码 <AppIcon name="github" :size="13"
          /></a>
        </div>
      </div>
    </div>
  </article>
</template>
<style scoped>
.project-card {
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-surface);
  transition: border-color 0.3s;
}
.project-card:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
}
.project-visual {
  height: 275px;
  position: relative;
  background: #20271e;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding-top: 25px;
}
.project-visual-grid {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #b6d18514, transparent 75%);
}
.visual-caption {
  position: absolute;
  left: 24px;
  top: 17px;
  font: 7px var(--font-mono);
  letter-spacing: 0.12em;
  color: #9aa58c;
}
.mini-browser {
  width: 77%;
  border: 1px solid #89987933;
  border-radius: 8px;
  box-shadow: 0 20px 40px #0005;
  position: relative;
  transition: transform 0.65s cubic-bezier(0.2, 1, 0.3, 1);
  transform: perspective(850px) rotateY(-8deg) rotateX(7deg) rotateZ(-3deg);
}
.project-card:hover .mini-browser {
  transform: perspective(850px) rotateY(0) rotateX(0) rotateZ(0)
    translateY(-5px);
}
.blog-preview {
  padding: 17px 20px 14px;
  background: #101310;
  color: #d8ded1;
}
.mini-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d0dfbd12;
  padding-bottom: 12px;
  font-size: 9px;
}
.mini-toolbar > span:last-child {
  font-size: 5px;
  color: #8b9583;
}
.mini-hero {
  display: flex;
  align-items: center;
  padding: 18px 0 14px;
}
.mini-hero small {
  display: block;
  font: 4px var(--font-mono);
  color: #8f9f7c;
  margin-bottom: 8px;
}
.mini-hero b {
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.05em;
  display: block;
  font-weight: 500;
}
.mini-hero em {
  color: #c2f87c;
  font-family: var(--font-serif-cn);
  font-size: 36px;
}
.mini-button {
  display: inline-block;
  background: #c2f87c;
  color: #1c2a0e;
  border-radius: 12px;
  font-size: 5px;
  padding: 4px 8px;
  margin-top: 10px;
}
.mini-knot {
  margin-left: auto;
  font-size: 102px;
  line-height: 1;
  background: linear-gradient(
    135deg,
    #f2ffe6,
    #758761 40%,
    #b8d09a 60%,
    #313e22
  );
  background-clip: text;
  color: transparent;
  text-shadow: 8px 8px 20px #b4ec5e11;
}
.mini-cards {
  display: flex;
  gap: 8px;
}
.mini-cards i {
  flex: 1;
  height: 28px;
  border: 1px solid #c2f87c15;
  border-radius: 3px;
  background: #a4c47505;
}
.todo-app {
  background: #292a24;
}
.todo-preview {
  display: flex;
  min-height: 190px;
  color: #353c2a;
  background: #f0f1e5;
  transform: perspective(850px) rotateY(8deg) rotateX(6deg) rotateZ(3deg);
}
.todo-sidebar {
  width: 40px;
  flex-shrink: 0;
  background: #e2e6d6;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 14px;
  padding-top: 13px;
  font-size: 19px;
  border-radius: 8px 0 0 8px;
}
.todo-sidebar span {
  font-size: 10px;
}
.todo-content {
  flex: 1;
  padding: 20px 16px;
}
.todo-content > small {
  display: block;
  font: 4px var(--font-mono);
  letter-spacing: 0.12em;
  color: #788065;
}
.todo-content > b {
  display: block;
  font-size: 15px;
  letter-spacing: -0.04em;
  margin: 8px 0 12px;
}
.todo-content > b span {
  display: block;
  font-size: 6px;
  font-weight: 400;
  letter-spacing: 0;
  color: #84896f;
  margin-top: 3px;
}
.todo-row {
  display: flex;
  gap: 7px;
  align-items: center;
  background: #fafbf3;
  padding: 8px;
  border: 1px solid #e4e7d8;
  border-radius: 3px;
  margin-top: 5px;
  font-size: 6px;
}
.todo-row i {
  width: 9px;
  height: 9px;
  border: 1px solid #bac6a6;
  border-radius: 3px;
  line-height: 8px;
  font-style: normal;
}
.todo-row i.done {
  background: #8ba265;
  color: white;
}
.todo-row small {
  font: 4px var(--font-mono);
  margin-left: auto;
  color: #859371;
}
.project-body {
  padding: 24px;
}
.project-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.project-title-row h3 {
  font-size: 20px;
  font-weight: 500;
}
.project-title-row svg {
  color: var(--text-muted);
}
.project-body > p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.9;
  margin-top: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.project-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 22px;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.project-tags span {
  font: 8px var(--font-mono);
  color: var(--text-muted);
}
.project-links {
  display: flex;
  gap: 14px;
}
.project-links a {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 10px;
  color: var(--ink);
  white-space: nowrap;
}
.project-links a:hover {
  color: var(--accent);
}
.utility-preview {
  width: 73%;
  border-radius: 8px;
  padding: 22px;
  color: #dbe3d0;
  background: #1b211d;
  position: relative;
  box-shadow: 0 15px 35px #0005;
}
.utility-preview > span {
  display: block;
  font: 8px var(--font-mono);
  letter-spacing: 0.1em;
}
.weather-preview > b {
  display: block;
  font-size: 63px;
  line-height: 1.3;
  font-weight: 400;
  letter-spacing: -0.1em;
}
.weather-preview > b span {
  color: #c2f87c;
}
.weather-preview p {
  font-size: 10px;
}
.weather-preview p span {
  position: absolute;
  right: 26px;
  top: 50px;
  font-size: 70px;
  color: #c2f87c;
}
.weather-preview > div {
  font-size: 8px;
  margin-top: 15px;
  border-top: 1px solid #46583a;
  padding-top: 12px;
}
.weather-preview > div span {
  margin-left: 20px;
}
.editor-preview > span {
  border-bottom: 1px solid #46583a;
  padding-bottom: 12px;
}
.editor-preview i {
  float: right;
  font-style: normal;
  font-size: 5px;
}
.editor-preview b {
  display: block;
  font-size: 20px;
  margin-top: 16px;
}
.editor-preview em {
  font-style: normal;
  color: #c2f87c;
}
.editor-preview p {
  font-size: 9px;
  margin-top: 9px;
}
.editor-preview > div {
  font: 7px var(--font-mono);
  margin-top: 14px;
  background: #c2f87c08;
  padding: 8px;
}
.editor-preview strong {
  color: #c2f87c;
}
@media (max-width: 640px) {
  .project-visual {
    height: 240px;
  }
  .project-body {
    padding: 22px;
  }
  .project-tags {
    gap: 7px;
  }
  .project-tags span {
    font-size: 7px;
  }
}
</style>
