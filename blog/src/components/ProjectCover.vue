<script setup lang="ts">
import type { Project } from '../types'

defineProps<{ project: Project; index: number }>()
</script>

<template>
  <div
    class="project-cover"
    :class="`cover-${project.cover}`"
    aria-hidden="true"
  >
    <div class="cover-grid"></div>
    <div class="cover-topline">
      <span>SELECTED WORK / {{ String(index + 1).padStart(2, '0') }}</span>
      <span class="cover-mark">↗</span>
    </div>
    <div class="cover-copy">
      <span class="cover-category">{{ project.category }}</span>
      <strong
        >{{ project.coverTitle[0] }}<em>{{ project.coverTitle[1] }}</em></strong
      >
    </div>

    <div v-if="project.cover === 'science'" class="cover-art science-art">
      <div class="orbit orbit-one"></div>
      <div class="orbit orbit-two"></div>
      <div class="orbit orbit-three"></div>
      <div class="science-globe"></div>
      <div class="orbit-dot"></div>
      <span class="art-annotation">天地之间 · 探索万物</span>
    </div>
    <div
      v-else-if="project.cover === 'commerce'"
      class="cover-art commerce-art"
    >
      <div class="business-layer layer-back">
        <span>MEMBERS</span><b>会员</b><i></i>
      </div>
      <div class="business-layer layer-middle">
        <span>PROJECTS</span><b>项目</b><i></i>
      </div>
      <div class="business-layer layer-front">
        <span>WORKSPACE</span><b>商会中心 <span>↗</span></b>
        <div class="module-dots"><i></i><i></i><i></i><i></i></div>
      </div>
    </div>
    <div v-else-if="project.cover === 'jiwo'" class="cover-art jiwo-art">
      <div class="note note-back">
        <span>记录</span>
        <div class="note-lines"><i></i><i></i><i></i></div>
      </div>
      <div class="note note-front">
        <span>即我 <small>安排</small></span
        ><b>把日常，<br />安放妥当。</b>
        <div class="note-check"><i>✓</i><span>记录 · 安排 · 完成</span></div>
      </div>
    </div>
    <div v-else class="cover-art journal-art">
      <div class="journal-orbit"></div>
      <div class="journal-orbit orbit-vertical"></div>
      <div class="journal-star">✳</div>
      <span class="art-annotation">A DEVELOPER'S JOURNAL</span>
    </div>
    <div class="cover-bottom">
      <span>THEKINGOFLXM</span
      ><span>{{ project.tags.slice(0, 2).join(' + ') }}</span>
    </div>
  </div>
</template>

<style scoped>
.project-cover {
  --cover-accent: #c2f87c;
  --cover-ink: #eef2e5;
  --cover-muted: #a7b49a;
  position: relative;
  height: 300px;
  overflow: hidden;
  isolation: isolate;
  color: var(--cover-ink);
  background: #19231d;
  container-type: inline-size;
}
.cover-grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.35;
  background-image:
    linear-gradient(#a5c9a514 1px, transparent 1px),
    linear-gradient(90deg, #a5c9a514 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(110deg, transparent 10%, #000 100%);
}
.cover-topline,
.cover-bottom {
  position: absolute;
  left: 26px;
  right: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--cover-muted);
  font: 8px var(--font-mono);
  letter-spacing: 0.1em;
  z-index: 2;
}
.cover-topline {
  top: 20px;
}
.cover-mark {
  font-size: 17px;
}
.cover-bottom {
  bottom: 20px;
}
.cover-copy {
  position: absolute;
  left: 30px;
  top: 91px;
  z-index: 2;
}
.cover-category {
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--cover-muted);
}
.cover-copy strong {
  display: block;
  margin-top: 12px;
  font: 500 clamp(25px, 6.4cqw, 41px)/1.12 var(--font-display);
  letter-spacing: -0.055em;
}
.cover-copy em {
  display: block;
  color: var(--cover-accent);
  font: italic 1.18em/1.1 var(--font-serif-cn);
  letter-spacing: -0.02em;
}
.cover-art {
  position: absolute;
  width: 230px;
  height: 230px;
  right: 2%;
  top: 36px;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-cover:hover .cover-art {
  transform: translateY(-5px) rotate(3deg);
}
.art-annotation {
  position: absolute;
  bottom: 2px;
  width: 100%;
  text-align: center;
  font: 7px var(--font-mono);
  letter-spacing: 0.2em;
  color: var(--cover-muted);
}
.cover-science {
  --cover-accent: #e9c68a;
  --cover-muted: #beae91;
  background:
    radial-gradient(ellipse at 85% 48%, #62523a70, transparent 57%), #23251e;
}
.science-globe {
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  top: 53px;
  left: 60px;
  background:
    repeating-linear-gradient(0deg, transparent 0 12px, #d8bd7c35 12px 13px),
    radial-gradient(
      circle at 30% 22%,
      #e7c895,
      #8a764b 25%,
      #3a3b2a 60%,
      #171d16 80%
    );
  box-shadow:
    inset -12px -7px 18px #0c171a99,
    inset 1px 1px 2px #f7dbb3,
    0 0 35px #bc98661a;
}
.orbit {
  position: absolute;
  inset: 19px;
  border: 1px solid #dabb80a6;
  border-radius: 50%;
  box-shadow: 0 1px 1px #e3c78555;
}
.orbit-one {
  transform: rotate(-28deg) scaleY(0.48);
  z-index: 1;
}
.orbit-two {
  transform: rotate(58deg) scaleY(0.43);
}
.orbit-three {
  transform: rotate(-65deg) scaleY(0.75);
  border-color: #dabb8045;
}
.orbit-dot {
  position: absolute;
  top: 48px;
  right: 32px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #efd5a7;
  box-shadow: 0 0 17px #e5c28088;
}
.cover-commerce {
  background:
    radial-gradient(ellipse at 80% 20%, #44736145, transparent 62%), #182922;
}
.commerce-art {
  perspective: 850px;
  right: 0;
}
.business-layer {
  position: absolute;
  width: 158px;
  height: 103px;
  padding: 15px;
  border: 1px solid #a2c9a644;
  border-radius: 10px;
  background: linear-gradient(140deg, #344b3f, #1b2e24);
  box-shadow: 0 18px 25px #071c154d;
  transform: rotateY(-20deg) rotateX(15deg) rotateZ(-9deg);
}
.business-layer > span {
  font: 7px var(--font-mono);
  letter-spacing: 0.12em;
  color: #a8baa5;
}
.business-layer b {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 400;
}
.business-layer b span {
  float: right;
  font-weight: 300;
}
.layer-back {
  top: 1px;
  left: 51px;
  opacity: 0.58;
}
.layer-middle {
  top: 57px;
  left: 29px;
  opacity: 0.8;
}
.layer-front {
  top: 116px;
  left: 8px;
  color: #1d3224;
  background: linear-gradient(125deg, #dfefc2, #a8c783);
  border-color: #e0edcb;
}
.layer-front > span {
  color: #4f6444;
}
.module-dots {
  display: flex;
  gap: 5px;
  margin-top: 12px;
}
.module-dots i {
  height: 4px;
  width: 24px;
  background: #587b3b3b;
  border-radius: 2px;
}
.module-dots i:first-child {
  background: #42672d;
}
.cover-jiwo {
  --cover-ink: #2b3f36;
  --cover-muted: #596e5d;
  --cover-accent: #457653;
  background: #dfe6d7;
}
.cover-jiwo .cover-grid {
  opacity: 0.7;
  background-image:
    linear-gradient(#526e4810 1px, transparent 1px),
    linear-gradient(90deg, #526e4810 1px, transparent 1px);
}
.jiwo-art {
  right: 0;
  perspective: 800px;
}
.note {
  position: absolute;
  width: 148px;
  height: 182px;
  border-radius: 9px;
  padding: 18px;
  border: 1px solid #c2cbbb;
  background: #f5f6ed;
  box-shadow: 0 18px 30px #40523826;
}
.note-back {
  top: 3px;
  left: 54px;
  transform: rotate(12deg);
  background: #b8c9ab;
}
.note-back > span {
  font-size: 10px;
}
.note-front {
  top: 32px;
  left: 20px;
  transform: rotate(-8deg);
}
.note-front > span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 15px;
}
.note-front small {
  color: #84947b;
  font-size: 9px;
  font-weight: 400;
}
.note-front b {
  display: block;
  margin-top: 25px;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 500;
  letter-spacing: -0.03em;
}
.note-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 7px;
  margin-top: 18px;
  color: #748567;
}
.note-check i {
  font-style: normal;
  color: #f5f6ed;
  background: #7e9969;
  width: 13px;
  height: 13px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.note-lines i {
  display: block;
  height: 4px;
  background: #667c4e33;
  margin-top: 12px;
}
.cover-journal {
  background:
    radial-gradient(ellipse at 75% 50%, #77944e25, transparent 65%), #141b14;
}
.journal-art {
  perspective: 650px;
}
.journal-star {
  position: absolute;
  inset: 30px;
  display: grid;
  place-items: center;
  color: #c2f87c;
  font: 170px/1 var(--font-sans);
  text-shadow:
    5px 10px 0 #5c7834,
    15px 20px 30px #0008;
  transform: rotate(-16deg) rotateY(-15deg);
}
.journal-orbit {
  position: absolute;
  inset: 10px;
  border: 1px solid #a1c87750;
  border-radius: 50%;
  transform: rotate(-26deg) scaleY(0.4);
}
.orbit-vertical {
  transform: rotate(65deg) scaleY(0.6);
  border-style: dashed;
  opacity: 0.5;
}
@container (max-width: 490px) {
  .cover-art {
    right: -28px;
    transform: scale(0.85);
  }
  .project-cover:hover .cover-art {
    transform: scale(0.85) translateY(-5px);
  }
  .cover-copy {
    left: 22px;
  }
}
@container (max-width: 370px) {
  .cover-art {
    right: -43px;
    transform: scale(0.72);
  }
  .project-cover:hover .cover-art {
    transform: scale(0.72) translateY(-5px);
  }
  .cover-copy strong {
    font-size: 25px;
  }
  .cover-category {
    font-size: 8px;
    letter-spacing: 0;
  }
  .cover-bottom,
  .cover-topline {
    left: 20px;
    right: 20px;
    font-size: 7px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cover-art {
    transition: none;
  }
}
</style>
