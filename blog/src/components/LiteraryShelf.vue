<script setup lang="ts">
import { literaryCollections, literaryWorks } from '../lib/literature'
import AppIcon from './AppIcon.vue'
const shelves = (['shi', 'ci'] as const).map((kind) => ({
  kind,
  ...literaryCollections[kind],
  works: literaryWorks.filter((work) => work.kind === kind),
}))
</script>

<template>
  <section aria-labelledby="literary-shelf-title">
    <div class="section-label reveal">
      <span class="num">03 / BETWEEN THE LINES</span>
      <h2 id="literary-shelf-title">诗与词<span class="title-dot">.</span></h2>
    </div>
    <div class="literary-shelves">
      <router-link
        v-for="shelf in shelves"
        :key="shelf.kind"
        :to="shelf.path"
        class="literary-shelf reveal"
        data-pointer-surface
        data-cursor-label="入卷"
      >
        <span class="pointer-shine" aria-hidden="true"></span>
        <div class="shelf-top">
          <span>{{ shelf.english }}</span
          ><span
            >{{ String(shelf.works.length).padStart(2, '0') }}
            {{ shelf.unit }}</span
          >
        </div>
        <div class="shelf-main">
          <span class="shelf-character" aria-hidden="true">{{
            shelf.title
          }}</span>
          <div>
            <h3>{{ shelf.title }}集</h3>
            <p>
              {{
                shelf.kind === 'shi'
                  ? '东风入夜来，淡月映楼台。'
                  : '望长江万里向东流，沧波浩无穷。'
              }}
            </p>
          </div>
        </div>
        <div class="shelf-bottom">
          <span>{{ shelf.subtitle }}</span
          ><AppIcon name="diagonal" :size="20" />
        </div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.literary-shelves {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}
.literary-shelf {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 4px 18px 4px 4px;
  background: linear-gradient(150deg, var(--bg-surface), var(--bg-page));
  padding: 28px 32px;
  color: var(--text-body);
  transition: border-color 0.3s;
}
.literary-shelf:hover {
  border-color: var(--accent);
}
.shelf-top {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font: 9px var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.shelf-main {
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 24px 0 28px;
}
.shelf-character {
  font: 90px/1.2 var(--font-literary);
  color: var(--accent);
  opacity: 0.6;
}
.shelf-main h3 {
  font: 24px var(--font-literary);
  letter-spacing: 0.15em;
  margin-bottom: 14px;
}
.shelf-main p {
  font: 15px/2 var(--font-literary);
  color: var(--text-muted);
}
.shelf-bottom {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-top: 18px;
  border-top: 1px solid var(--border-soft);
  font-size: 10px;
  color: var(--text-muted);
}
.shelf-bottom svg {
  color: var(--accent);
}
@media (max-width: 760px) {
  .literary-shelves {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .literary-shelf {
    padding: 25px;
  }
  .shelf-character {
    font-size: 72px;
  }
  .shelf-main {
    gap: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .literary-shelf {
    transition: none;
  }
}
</style>
