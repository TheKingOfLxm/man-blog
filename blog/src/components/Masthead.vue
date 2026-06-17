<script setup lang="ts">
import site from '../data/site.json'
</script>

<template>
  <header class="masthead">
    <div class="kicker">{{ site.kicker }}</div>
    <h1 class="title">{{ site.name }}</h1>
    <div class="volume"><i></i>{{ site.volume }}<i></i></div>
  </header>
</template>

<style scoped>
.masthead {
  text-align: center;
  padding: 64px 0 26px;
  border-bottom: 2px solid var(--rule);
}
.kicker {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
}
.title {
  font-size: clamp(30px, 6vw, 48px);
  margin-top: 12px;
  color: var(--ink);
  line-height: 1;
}
.volume {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.volume i {
  display: inline-block;
  width: 32px;
  height: 1px;
  background: var(--text-muted);
}
</style>
