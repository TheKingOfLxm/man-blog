<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import {
  useDocumentVisibility,
  useElementVisibility,
  useEventListener,
  usePreferredReducedMotion,
  useRafFn,
  useResizeObserver,
} from '@vueuse/core'
import * as THREE from 'three'
import { useThemeStore } from '../stores/theme'

const host = ref<HTMLElement | null>(null)
const ready = ref(false)
const failed = ref(false)
const paused = ref(false)
const theme = useThemeStore()
const reduced = usePreferredReducedMotion()
const visibility = useDocumentVisibility()
const inView = useElementVisibility(host)
const canAnimate = computed(
  () =>
    ready.value &&
    !failed.value &&
    !paused.value &&
    reduced.value !== 'reduce' &&
    visibility.value === 'visible' &&
    inView.value,
)
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let sculpture: THREE.Group | undefined
let globe: THREE.Group | undefined
const orbiters: {
  mesh: THREE.Mesh
  radius: number
  phase: number
  speed: number
}[] = []
const coreUniforms = { uTime: { value: 0 } }
const orbitalColors = new Map<
  THREE.MeshBasicMaterial | THREE.PointsMaterial,
  { color: number; opacity: number }
>()
let elapsed = 0
const pointer = { x: 0, y: 0 }
const { pause, resume } = useRafFn(
  ({ delta }) => {
    if (!renderer || !scene || !camera || !sculpture) return
    elapsed += Math.min(delta, 40) / 1000
    const step = Math.min(delta, 40) / 1000
    sculpture.rotation.y = THREE.MathUtils.damp(
      sculpture.rotation.y,
      pointer.x * 0.45,
      3,
      step,
    )
    sculpture.rotation.x = THREE.MathUtils.damp(
      sculpture.rotation.x,
      pointer.y * 0.3,
      3,
      step,
    )
    sculpture.position.y = Math.sin(elapsed * 0.65) * 0.07
    if (globe) globe.rotation.y = elapsed * 0.08
    coreUniforms.uTime.value = elapsed
    for (const orbiter of orbiters) {
      const angle = orbiter.phase + elapsed * orbiter.speed
      orbiter.mesh.position.set(
        Math.cos(angle) * orbiter.radius,
        Math.sin(angle) * orbiter.radius,
        0,
      )
    }
    renderer.render(scene, camera)
  },
  { immediate: false },
)
watch(canAnimate, (value) => (value ? resume() : pause()))

function renderOnce() {
  if (renderer && scene && camera && !failed.value)
    renderer.render(scene, camera)
}
function updateOrbitalColors() {
  for (const [material, original] of orbitalColors) {
    material.color.setHex(original.color).multiplyScalar(theme.isDark ? 1 : 0.18)
    material.opacity = theme.isDark ? original.opacity : Math.min(1, original.opacity * 1.4 + 0.1)
  }
  renderOnce()
}
watch(() => theme.isDark, updateOrbitalColors)
function resize() {
  if (!host.value || !renderer || !camera || failed.value) return
  const { width, height } = host.value.getBoundingClientRect()
  if (!width || !height) return
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderOnce()
}
useResizeObserver(host, resize)
useEventListener(host, 'pointermove', (event) => {
  if (event.pointerType === 'touch' || !canAnimate.value || !host.value) return
  const rect = host.value.getBoundingClientRect()
  pointer.x = (event.clientX - rect.left) / rect.width - 0.5
  pointer.y = (event.clientY - rect.top) / rect.height - 0.5
})
useEventListener(host, 'pointerleave', () => {
  pointer.x = 0
  pointer.y = 0
})
useEventListener(
  host,
  'webglcontextlost',
  (event) => {
    event.preventDefault()
    failed.value = true
    ready.value = false
    pause()
  },
  { capture: true },
)

function dispose() {
  pause()
  scene?.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
      object.geometry.dispose()
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]
      materials.forEach((material) => material.dispose())
    }
  })
  orbiters.length = 0
  orbitalColors.clear()
  renderer?.dispose()
  renderer?.domElement.remove()
}
onMounted(() => {
  if (!host.value) return
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.value.prepend(renderer.domElement)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    camera.position.set(0, 0, 8.5)
    sculpture = new THREE.Group()
    scene.add(sculpture)
    globe = new THREE.Group()
    globe.rotation.z = -0.18
    sculpture.add(globe)

    // A procedural glass-like surface: fine latitude lines, a soft scan and Fresnel rim.
    // Everything is rendered locally; there are no texture or HDR downloads.
    const surfaceVertex = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.28, 96, 64),
      new THREE.ShaderMaterial({
        uniforms: coreUniforms,
        vertexShader: surfaceVertex,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec3 normal = normalize(vNormal);
            float facing = max(dot(normal, normalize(vView)), 0.0);
            float fresnel = pow(1.0 - facing, 3.0);
            vec2 gridUv = vUv * vec2(40.0, 24.0);
            vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / max(fwidth(gridUv), vec2(0.0001));
            float lines = 1.0 - min(min(grid.x, grid.y), 1.0);
            float light = max(dot(normal, normalize(vec3(-0.5, 0.8, 1.0))), 0.0);
            float scan = exp(-pow((vUv.y - (0.5 + sin(uTime * 0.24) * 0.3)) * 28.0, 2.0));
            float sheen = pow(max(dot(reflect(-normalize(vec3(-0.8, 1.4, 2.0)), normal), normalize(vView)), 0.0), 42.0);
            vec3 color = mix(vec3(0.008, 0.022, 0.017), vec3(0.035, 0.078, 0.048), light);
            color += vec3(0.44, 0.79, 0.27) * lines * (0.14 + fresnel * 0.45 + scan * 0.15);
            color += vec3(0.58, 0.93, 0.36) * fresnel * 0.8;
            color += vec3(0.55, 0.83, 0.57) * sheen * 0.65;
            color += vec3(0.17, 0.4, 0.12) * scan * 0.16;
            gl_FragColor = vec4(color, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    )
    globe.add(core)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.36, 64, 48),
      new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.4);
            gl_FragColor = vec4(0.54, 0.87, 0.3, rim * 0.38);
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    )
    sculpture.add(atmosphere)

    // Tilted orbital bands retain their silhouette while the core rotates independently.
    const orbitalPlane = new THREE.Group()
    orbitalPlane.rotation.set(1.03, 0.16, -0.4)
    sculpture.add(orbitalPlane)
    const ringBands = [
      { radius: 1.78, width: 0.009, opacity: 0.85, color: 0xd4f5a3 },
      { radius: 1.84, width: 0.003, opacity: 0.25, color: 0xbbe789 },
      { radius: 2.12, width: 0.004, opacity: 0.48, color: 0xc5d6ad },
      { radius: 2.23, width: 0.0025, opacity: 0.2, color: 0xc5d6ad },
    ]
    for (const band of ringBands) {
      orbitalPlane.add(
        new THREE.Mesh(
          new THREE.TorusGeometry(band.radius, band.width, 8, 192),
          new THREE.MeshBasicMaterial({
            color: band.color,
            transparent: true,
            opacity: band.opacity,
          }),
        ),
      )
    }
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(2.12, 0.012, 8, 120, Math.PI * 0.46),
      new THREE.MeshBasicMaterial({ color: 0xd8ffaa }),
    )
    arc.rotation.z = 3.6
    orbitalPlane.add(arc)

    for (const [index, radius] of [1.78, 2.12].entries()) {
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.055 : 0.032, 20, 16),
        new THREE.MeshBasicMaterial({ color: 0xe5ffc2 }),
      )
      const phase = index === 0 ? 0.45 : 3.9
      moon.position.set(Math.cos(phase) * radius, Math.sin(phase) * radius, 0)
      orbitalPlane.add(moon)
      orbiters.push({
        mesh: moon,
        radius,
        phase,
        speed: index === 0 ? 0.22 : -0.12,
      })
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.11 : 0.065, 16, 12),
        new THREE.MeshBasicMaterial({
          color: 0xc2f87c,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        }),
      )
      moon.add(halo)
    }

    const dustPositions = new Float32Array(180 * 3)
    for (let i = 0; i < 180; i++) {
      // Deterministic distribution keeps the still frame and reloads consistent.
      const angle = i * 2.399963
      const radius = 1.6 + (((i * 73) % 101) / 101) * 1.45
      dustPositions[i * 3] = Math.cos(angle) * radius
      dustPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.75
      dustPositions[i * 3 + 2] = -0.8 - (((i * 31) % 59) / 59) * 1.3
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(dustPositions, 3),
    )
    sculpture.add(
      new THREE.Points(
        dustGeometry,
        new THREE.PointsMaterial({
          color: 0xb8d59a,
          size: 0.016,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      ),
    )
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        const material = object.material
        if (material instanceof THREE.MeshBasicMaterial || material instanceof THREE.PointsMaterial) {
          orbitalColors.set(material, { color: material.color.getHex(), opacity: material.opacity })
        }
      }
    })
    updateOrbitalColors()
    resize()
    ready.value = true
  } catch {
    failed.value = true
    dispose()
  }
})
onBeforeUnmount(dispose)
</script>
<template>
  <div
    class="scene-frame"
    :class="{ 'is-ready': ready, 'is-paused': paused || reduced === 'reduce' }"
  >
    <div class="scene-grid" aria-hidden="true"></div>
    <div class="scene-glow" aria-hidden="true"></div>
    <div
      ref="host"
      class="scene-canvas"
      role="img"
      aria-label="随鼠标轻轻倾转的悬浮星核：发光经纬线、深绿玻璃球体与环绕光轨"
    >
      <div v-if="!ready" class="fallback-sculpture" aria-hidden="true">
        <i class="fallback-core"></i><i class="fallback-ring"></i
        ><i class="fallback-ring outer"></i>
      </div>
    </div>
    <div class="scene-corner top-left">
      ORBITAL / 001<br /><span>A SMALL UNIVERSE OF IDEAS</span>
    </div>
    <div class="scene-corner top-right">✳</div>
    <div class="scene-tag"><span></span> IDEAS IN ORBIT</div>
    <div class="scene-bottom">
      <span
        >{{ failed ? 'STILL EXPLORING' : 'MOVE TO EXPLORE' }}
        <span class="tiny-cross">+</span></span
      ><button
        v-if="ready && reduced !== 'reduce'"
        @click="paused = !paused"
        :aria-label="paused ? '播放 3D 动画' : '暂停 3D 动画'"
        :aria-pressed="paused"
      >
        {{ paused ? '▶' : 'Ⅱ' }}</button
      ><span v-else>∞</span>
    </div>
  </div>
</template>
<style scoped>
.scene-frame {
  position: relative;
  width: 100%;
  height: 520px;
  isolation: isolate;
}
.scene-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border-soft) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-soft) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(ellipse, #0009, transparent 68%);
}
.scene-glow {
  position: absolute;
  inset: 12%;
  background: radial-gradient(ellipse, #98de5b18, transparent 65%);
  filter: blur(32px);
}
.scene-canvas {
  position: absolute;
  inset: 0;
}
.scene-canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
.scene-corner {
  position: absolute;
  font: 8px/1.7 var(--font-mono);
  color: var(--text-muted);
  letter-spacing: 0.08em;
  pointer-events: none;
}
.top-left {
  top: 26px;
  left: 20px;
}
.top-left span {
  font-size: 7px;
  color: var(--text-faint);
}
.top-right {
  top: 20px;
  right: 12px;
  font-size: 30px;
  color: var(--accent);
}
.scene-tag {
  position: absolute;
  bottom: 90px;
  right: 0;
  border: 1px solid var(--border);
  border-radius: 50px;
  backdrop-filter: blur(15px);
  background: color-mix(in srgb, var(--bg-page) 60%, transparent);
  padding: 9px 14px;
  font: 8px var(--font-mono);
  color: var(--text-body);
  letter-spacing: 0.06em;
  transform: rotate(-7deg);
}
.scene-tag > span {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
  margin-right: 7px;
}
.scene-bottom {
  position: absolute;
  bottom: 16px;
  left: 20px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 8px var(--font-mono);
  letter-spacing: 0.15em;
  color: var(--text-faint);
}
.tiny-cross {
  color: var(--accent);
  margin-left: 16px;
  font-size: 15px;
}
.scene-bottom button {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  font-size: 11px;
}
.fallback-sculpture {
  position: absolute;
  inset: 12%;
  display: grid;
  place-items: center;
}
.fallback-sculpture i {
  position: absolute;
  border-radius: 50%;
}
.fallback-core {
  width: 60%;
  aspect-ratio: 1;
  border: 1px solid #bcf486;
  background: radial-gradient(
    circle at 32% 23%,
    #92ba6540,
    #15271b 38%,
    #09160d 70%
  );
  box-shadow:
    inset -4px -2px 18px #b7ff7660,
    0 0 28px #a5fa5420;
}
.fallback-ring {
  width: 98%;
  height: 34%;
  border: 1px solid #bfeba0b0;
  transform: rotate(-23deg);
  box-shadow: 0 0 7px #a5fa5420;
}
.fallback-ring.outer {
  width: 112%;
  height: 40%;
  opacity: 0.35;
}
@media (max-width: 1000px) {
  .scene-frame {
    height: 440px;
  }
}
@media (max-width: 760px) {
  .scene-frame {
    height: 360px;
  }
  .scene-tag {
    right: 6%;
    bottom: 55px;
  }
  .scene-corner.top-left {
    top: 10px;
  }
}
</style>
