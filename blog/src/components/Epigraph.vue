<script setup lang="ts">
import site from '../data/site.json'
</script>

<template>
  <section class="epigraph">
    <div class="label">{{ site.epigraph.label }}</div>
    <div class="poem">
      <p v-for="(s, i) in site.epigraph.stanzas" :key="i" class="stanza">{{ s }}</p>
    </div>
    <div class="attribution">{{ site.epigraph.attribution }}</div>
    <div class="topics">
      <span v-for="t in site.topics" :key="t">{{ t }}</span>
    </div>
  </section>
</template>

<style scoped>
.epigraph {
  text-align: center;
  padding: 34px 8px 30px;
  border-bottom: 1px solid var(--border);
}
.label {
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 20px;
}
.poem {
  font-family: var(--font-serif-cn);
  color: var(--text-body);
  font-size: clamp(14px, 2vw, 16px);
  line-height: 2.1;
  letter-spacing: 0.04em;
  max-width: 640px;
  margin: 0 auto;
}
.stanza {
  margin-bottom: 10px;
}
.stanza:last-child {
  margin-bottom: 0;
}
.attribution {
  font-family: var(--font-serif-cn);
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.06em;
  margin-top: 20px;
}
.topics {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 18px;
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  font-weight: 600;
}
.topics span {
  color: var(--accent);
}
</style>
