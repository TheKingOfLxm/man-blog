<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  useDocumentVisibility,
  useEventListener,
  useMediaQuery,
  usePreferredReducedMotion,
  useRafFn,
} from '@vueuse/core'

const props = defineProps<{ disabled?: boolean }>()
const route = useRoute()
const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
const reducedMotion = usePreferredReducedMotion()
const visibility = useDocumentVisibility()
const enabled = computed(
  () =>
    finePointer.value &&
    reducedMotion.value !== 'reduce' &&
    visibility.value === 'visible' &&
    !props.disabled,
)
const halo = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)
const visible = ref(false)
const interactive = ref(false)
const pressed = ref(false)
const label = ref('')

let x = 0
let y = 0
let ringX = 0
let ringY = 0
let haloX = 0
let haloY = 0
let target: Element | null = null
let dirty = false
let surface: HTMLElement | null = null
let magnet: HTMLElement | null = null
let magnetBounds: DOMRect | null = null
const clamp = (value: number) => Math.max(-1, Math.min(1, value))

function clearSurface() {
  if (!surface) return
  surface.removeAttribute('data-pointer-active')
  for (const name of [
    '--pointer-rx',
    '--pointer-ry',
    '--pointer-x',
    '--pointer-y',
  ])
    surface.style.removeProperty(name)
  surface = null
}

function clearMagnet() {
  magnet?.style.removeProperty('--magnet-x')
  magnet?.style.removeProperty('--magnet-y')
  magnet = null
  magnetBounds = null
}

function updateTargets() {
  const nextSurface =
    target?.closest<HTMLElement>('[data-pointer-surface]') ?? null
  const nextMagnet = target?.closest<HTMLElement>('[data-magnetic]') ?? null
  // Read layout before writing styles; the tilt lives inside a stable hit area.
  const bounds = nextSurface?.getBoundingClientRect()
  const nextMagnetBounds =
    nextMagnet === magnet ? magnetBounds : nextMagnet?.getBoundingClientRect()
  if (surface !== nextSurface) {
    clearSurface()
    surface = nextSurface
  }
  if (magnet !== nextMagnet) {
    clearMagnet()
    magnet = nextMagnet
    magnetBounds = nextMagnetBounds ?? null
  }
  if (surface && bounds?.width && bounds.height) {
    const localX = Math.max(0, Math.min(bounds.width, x - bounds.left))
    const localY = Math.max(0, Math.min(bounds.height, y - bounds.top))
    surface.style.setProperty('--pointer-x', `${localX}px`)
    surface.style.setProperty('--pointer-y', `${localY}px`)
    surface.style.setProperty(
      '--pointer-rx',
      `${-clamp((localY / bounds.height) * 2 - 1) * 3}deg`,
    )
    surface.style.setProperty(
      '--pointer-ry',
      `${clamp((localX / bounds.width) * 2 - 1) * 4}deg`,
    )
    surface.setAttribute('data-pointer-active', '')
  }
  if (magnet && magnetBounds?.width && magnetBounds.height) {
    magnet.style.setProperty(
      '--magnet-x',
      `${clamp(((x - magnetBounds.left) / magnetBounds.width) * 2 - 1) * 6}px`,
    )
    magnet.style.setProperty(
      '--magnet-y',
      `${clamp(((y - magnetBounds.top) / magnetBounds.height) * 2 - 1) * 6}px`,
    )
  }
  interactive.value = Boolean(
    target?.closest('a, button:not(:disabled), [role="button"]'),
  )
  label.value =
    target?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ??
    ''
}

const { pause, resume } = useRafFn(
  ({ delta }) => {
    if (!enabled.value || !visible.value) {
      pause()
      return
    }
    if (dirty) {
      updateTargets()
      dirty = false
    }
    const ringEase = 1 - Math.exp(-Math.min(delta, 64) / 45)
    const haloEase = 1 - Math.exp(-Math.min(delta, 64) / 130)
    ringX += (x - ringX) * ringEase
    ringY += (y - ringY) * ringEase
    haloX += (x - haloX) * haloEase
    haloY += (y - haloY) * haloEase
    if (ring.value)
      ring.value.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
    if (halo.value)
      halo.value.style.transform = `translate3d(${haloX}px, ${haloY}px, 0)`
    if (dot.value) dot.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
    if (Math.abs(x - haloX) + Math.abs(y - haloY) < 0.1) pause()
  },
  { immediate: false },
)

function reset() {
  visible.value = false
  interactive.value = false
  pressed.value = false
  label.value = ''
  document.documentElement.removeAttribute('data-custom-cursor')
  target = null
  dirty = false
  pause()
  clearSurface()
  clearMagnet()
}

// VueUse removes these listeners when the device mode changes or the app unmounts.
const pointerDocument = computed(() => (enabled.value ? document : undefined))
useEventListener(
  pointerDocument,
  'pointermove',
  (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.buttons > 0) {
      reset()
      return
    }
    target = event.target instanceof Element ? event.target : null
    if (
      target?.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
      )
    ) {
      reset()
      return
    }
    x = event.clientX
    y = event.clientY
    if (!visible.value) {
      ringX = haloX = x
      ringY = haloY = y
    }
    visible.value = true
    document.documentElement.setAttribute('data-custom-cursor', '')
    dirty = true
    resume()
  },
  { passive: true },
)
useEventListener(
  pointerDocument,
  'pointerdown',
  (event: PointerEvent) => {
    if (event.pointerType === 'mouse') pressed.value = true
    else reset()
  },
  { passive: true },
)
useEventListener(
  pointerDocument,
  'pointerup',
  () => {
    pressed.value = false
  },
  { passive: true },
)
useEventListener(pointerDocument, 'pointerout', (event: PointerEvent) => {
  if (!event.relatedTarget) reset()
})
useEventListener(pointerDocument, 'pointercancel', reset)
useEventListener(pointerDocument, 'keydown', reset)
useEventListener('blur', reset)
useEventListener('resize', reset, { passive: true })
useEventListener('scroll', reset, { passive: true, capture: true })
watch(enabled, (value) => {
  if (!value) reset()
})
watch(() => route.fullPath, reset)
onBeforeUnmount(reset)
</script>

<template>
  <div
    class="pointer-effects"
    :class="{
      'is-visible': visible && enabled,
      'is-interactive': interactive,
      'is-pressed': pressed,
      'has-label': Boolean(label),
    }"
    aria-hidden="true"
  >
    <div ref="halo" class="pointer-halo"><i></i></div>
    <div ref="ring" class="pointer-ring">
      <div class="cursor-orbit">
        <span class="cursor-label">{{ label }} <span>↗</span></span>
      </div>
    </div>
    <div ref="dot" class="pointer-dot"><i></i></div>
  </div>
</template>

<style scoped>
.pointer-effects {
  position: fixed;
  inset: 0;
  z-index: 150;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.2s;
}
.pointer-effects.is-visible {
  opacity: 1;
}
.pointer-halo,
.pointer-ring,
.pointer-dot {
  position: absolute;
  inset: 0 auto auto 0;
  width: 0;
  height: 0;
  will-change: transform;
}
.pointer-halo i {
  display: block;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent) 8%, transparent),
    transparent 68%
  );
}
.cursor-orbit {
  position: relative;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid color-mix(in srgb, var(--accent) 65%, transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--bg-page) 25%, transparent);
  transition:
    width 0.25s,
    height 0.25s,
    border-radius 0.25s,
    transform 0.25s,
    background 0.25s,
    scale 0.15s;
}
.cursor-orbit::before,
.cursor-orbit::after {
  content: '';
  position: absolute;
  top: calc(50% - 0.5px);
  width: 4px;
  height: 1px;
  background: var(--accent);
  transition: opacity 0.15s;
}
.cursor-orbit::before {
  left: -3px;
}
.cursor-orbit::after {
  right: -3px;
}
.pointer-dot i {
  display: block;
  width: 4px;
  height: 4px;
  transform: translate(-50%, -50%);
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--bg-page) 80%, transparent);
}
.is-interactive .cursor-orbit {
  width: 42px;
  height: 42px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border-color: var(--accent);
}
.has-label .cursor-orbit {
  width: 84px;
  height: 34px;
  border-radius: 30px;
  transform: translate(-13px, -50%);
  background: var(--accent);
  color: var(--on-accent);
  border-color: var(--accent);
  box-shadow: 0 4px 20px #0002;
}
.has-label .cursor-orbit::before,
.has-label .cursor-orbit::after {
  opacity: 0;
}
.cursor-label {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-left: 13px;
  white-space: nowrap;
  opacity: 0;
  font: 500 10px var(--font-sans);
  letter-spacing: 0.06em;
  transition: opacity 0.15s;
}
.cursor-label > span {
  font-size: 15px;
}
.has-label .cursor-label {
  opacity: 1;
}
.has-label .pointer-dot i {
  background: var(--on-accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.is-pressed .cursor-orbit {
  scale: 0.86;
}
@media (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse) {
  .pointer-effects {
    display: none;
  }
}
</style>

<style>
.pointer-shine {
  display: none;
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  html[data-custom-cursor],
  html[data-custom-cursor] * {
    cursor: none !important;
  }
  html[data-custom-cursor]
    :is(input, textarea, [contenteditable='true'], [contenteditable='true'] *) {
    cursor: text !important;
  }
  html[data-custom-cursor] select {
    cursor: auto !important;
  }
  [data-pointer-surface] {
    position: relative;
  }
  .pointer-tilt {
    transform: perspective(1100px) rotateX(var(--pointer-rx, 0deg))
      rotateY(var(--pointer-ry, 0deg));
    transition:
      transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      border-color 0.3s;
  }
  [data-pointer-surface] .pointer-shine {
    display: block;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    background: radial-gradient(
      380px circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
      color-mix(in srgb, var(--accent) 12%, transparent),
      transparent 70%
    );
    transition: opacity 0.4s;
  }
  [data-pointer-active] .pointer-shine {
    opacity: 1;
  }
  [data-magnetic] {
    translate: var(--magnet-x, 0px) var(--magnet-y, 0px);
    transition:
      translate 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      background 0.3s,
      color 0.3s,
      border-color 0.3s,
      rotate 0.3s;
  }
}
</style>
