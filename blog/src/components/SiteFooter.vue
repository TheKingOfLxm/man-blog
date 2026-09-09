<script setup lang="ts">
import site from '../data/site.json'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <footer class="footer container">
    <div class="footer-top">
      <router-link to="/" class="footer-logo">✳ 小满<span>.</span></router-link>
      <p>保持好奇，持续创造。<span>STAY CURIOUS. KEEP BUILDING.</span></p>
      <div class="socials">
        <a
          :href="site.social.github"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          ><AppIcon name="github" /></a
        ><a :href="`mailto:${site.social.email}`" aria-label="发送邮件"
          ><AppIcon name="mail"
        /></a>
      </div>
    </div>
    <div class="footer-bottom">
      <span
        >© {{ new Date().getFullYear() }} {{ site.author }} · 用热爱构建</span
      ><router-link to="/tags">标签索引 ↗</router-link
      ><span>CRAFTED WITH CODE & CURIOSITY <i></i></span>
    </div>
  </footer>
</template>
<style scoped>
.footer {
  padding-top: 36px;
  padding-bottom: 30px;
  border-top: 1px solid var(--border);
}
.footer-top {
  display: flex;
  align-items: center;
  gap: 35px;
  padding-bottom: 36px;
}
.footer-logo {
  color: var(--ink);
  font-size: 25px;
  font-weight: 700;
}
.footer-logo span {
  color: var(--accent);
}
.footer-top p {
  font-size: 12px;
}
.footer-top p span {
  display: block;
  color: var(--text-faint);
  font: 8px var(--font-mono);
  letter-spacing: 0.1em;
  margin-top: 5px;
}
.socials {
  margin-left: auto;
  display: flex;
  gap: 12px;
}
.socials a {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text-muted);
}
.socials a:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding-top: 20px;
  border-top: 1px solid var(--border-soft);
  font: 9px var(--font-mono);
  color: var(--text-muted);
}
.footer-bottom a {
  color: var(--text-muted);
}
i {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  margin-left: 6px;
}
@media (max-width: 640px) {
  .footer-top {
    gap: 18px;
    flex-wrap: wrap;
  }
  .footer-bottom {
    flex-wrap: wrap;
    line-height: 1.8;
  }
  .footer-bottom > span:last-child {
    display: none;
  }
  .footer-top p {
    font-size: 10px;
  }
  .socials {
    gap: 6px;
  }
  .socials a {
    width: 34px;
    height: 34px;
  }
}
</style>
