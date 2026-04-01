import type { Directive } from 'vue'

export const vGlow: Directive = {
  mounted(el: HTMLElement) {
    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    const glow = document.createElement('div')
    glow.className = 'card-glow-overlay'
    glow.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: radial-gradient(
        600px circle at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(94, 198, 150, 0.12),
        transparent 60%
      );
      z-index: 1;
      border-radius: inherit;
    `
    el.appendChild(glow)

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      glow.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
      glow.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
    })

    el.addEventListener('mouseenter', () => {
      glow.style.opacity = '1'
    })

    el.addEventListener('mouseleave', () => {
      glow.style.opacity = '0'
    })
  }
}
