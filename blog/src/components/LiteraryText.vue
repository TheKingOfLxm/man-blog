<script setup lang="ts">
import { verseLines } from '../lib/literature'
import type { LiteraryWork } from '../types'

defineProps<{ work: LiteraryWork }>()
</script>

<template>
  <div class="literary-text" :class="{ 'is-poem': work.kind === 'shi' }">
    <p v-for="(stanza, index) in work.stanzas" :key="index" class="stanza">
      <span
        v-for="(line, lineIndex) in verseLines(stanza, work.kind)"
        :key="lineIndex"
        >{{ line }}</span
      >
    </p>
  </div>
</template>

<style scoped>
.literary-text {
  font-family: var(--font-literary);
  color: var(--ink);
  font-size: clamp(17px, 1.7vw, 21px);
  line-height: 2.5;
  letter-spacing: 0.08em;
  line-break: strict;
  overflow-wrap: anywhere;
}
.stanza + .stanza {
  margin-top: 1.8em;
}
.stanza span {
  display: block;
}
.is-poem {
  font-size: clamp(21px, 2.5vw, 30px);
  line-height: 2.9;
  letter-spacing: 0.24em;
}
@media (max-width: 600px) {
  .literary-text {
    letter-spacing: 0.04em;
    line-height: 2.25;
  }
  .is-poem {
    letter-spacing: 0.18em;
    line-height: 2.8;
  }
}
</style>
