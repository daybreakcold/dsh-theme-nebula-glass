/**
 * Generate the Nebula Glass backdrop artwork (original, license-free SVG).
 *
 * Writes design/wallpaper-dark.svg, design/wallpaper-light.svg and
 * design/wallpaper.data.mjs (base64 data URIs consumed by client.js).
 * Deterministic PRNG so the art is reproducible.
 *
 * Run: node design/generate-wallpaper.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const W = 1600
const H = 1000

/** Deterministic PRNG (mulberry32). */
function prng(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n) => String(Math.round(n * 10) / 10)

/** Round stars for one scene. */
function stars({ count, seed, colors, glowCount, glowColors, rMin = 0.35, rMax = 1.7, opacity = [0.22, 0.85] }) {
  const rand = prng(seed)
  const out = []
  for (let i = 0; i < count; i += 1) {
    const x = f(rand() * W)
    const y = f(rand() * H)
    const r = f(rMin + Math.pow(rand(), 3) * (rMax - rMin))
    const o = f(opacity[0] + rand() * (opacity[1] - opacity[0]))
    const color = colors[Math.floor(rand() * colors.length)]
    out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`)
  }
  for (let i = 0; i < glowCount; i += 1) {
    const x = f(rand() * W)
    const y = f(rand() * H)
    const r = f(5 + rand() * 11)
    const o = f(0.35 + rand() * 0.45)
    const color = glowColors[Math.floor(rand() * glowColors.length)]
    out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`)
  }
  return out.join('\n    ')
}

const dark = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05070F"/>
      <stop offset="0.32" stop-color="#091026"/>
      <stop offset="0.62" stop-color="#0A0F2A"/>
      <stop offset="1" stop-color="#04060D"/>
    </linearGradient>
    <radialGradient id="cyan"><stop offset="0" stop-color="#22D3EE" stop-opacity="0.44"/><stop offset="0.48" stop-color="#0891B2" stop-opacity="0.20"/><stop offset="1" stop-color="#0891B2" stop-opacity="0"/></radialGradient>
    <radialGradient id="violet"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.40"/><stop offset="0.5" stop-color="#7C3AED" stop-opacity="0.17"/><stop offset="1" stop-color="#7C3AED" stop-opacity="0"/></radialGradient>
    <radialGradient id="magenta"><stop offset="0" stop-color="#F472B6" stop-opacity="0.26"/><stop offset="0.5" stop-color="#BE185D" stop-opacity="0.11"/><stop offset="1" stop-color="#BE185D" stop-opacity="0"/></radialGradient>
    <radialGradient id="blue"><stop offset="0" stop-color="#3B82F6" stop-opacity="0.30"/><stop offset="0.55" stop-color="#1D4ED8" stop-opacity="0.13"/><stop offset="1" stop-color="#1D4ED8" stop-opacity="0"/></radialGradient>
    <radialGradient id="pale"><stop offset="0" stop-color="#A5F3FC" stop-opacity="0.22"/><stop offset="0.55" stop-color="#22D3EE" stop-opacity="0.08"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#EAF8FF" stop-opacity="0.95"/><stop offset="0.3" stop-color="#A5F3FC" stop-opacity="0.55"/><stop offset="1" stop-color="#A5F3FC" stop-opacity="0"/></radialGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#C7D2FE" stop-opacity="0"/>
      <stop offset="0.45" stop-color="#C7D2FE" stop-opacity="0.07"/>
      <stop offset="0.6" stop-color="#A5F3FC" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#C7D2FE" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g transform="rotate(-24 800 500)" opacity="0.85">
    <rect x="-240" y="352" width="2080" height="250" fill="url(#band)"/>
  </g>
  <ellipse cx="330" cy="210" rx="640" ry="500" fill="url(#cyan)"/>
  <ellipse cx="1260" cy="140" rx="600" ry="450" fill="url(#violet)"/>
  <ellipse cx="1040" cy="880" rx="700" ry="470" fill="url(#magenta)"/>
  <ellipse cx="110" cy="880" rx="560" ry="420" fill="url(#blue)"/>
  <ellipse cx="820" cy="500" rx="780" ry="520" fill="url(#blue)" opacity="0.5"/>
  <ellipse cx="610" cy="120" rx="340" ry="250" fill="url(#pale)" opacity="0.7"/>
  <g filter="url(#soft)" opacity="0.6">
    <ellipse cx="700" cy="330" rx="700" ry="100" fill="#22D3EE" opacity="0.16" transform="rotate(-14 700 330)"/>
    <ellipse cx="980" cy="690" rx="720" ry="86" fill="#A78BFA" opacity="0.14" transform="rotate(-9 980 690)"/>
    <ellipse cx="420" cy="620" rx="520" ry="70" fill="#3B82F6" opacity="0.12" transform="rotate(6 420 620)"/>
  </g>
  <g>
    ${stars({
      count: 190,
      seed: 20261114,
      colors: ['#EAF6FF', '#EAF6FF', '#EAF6FF', '#A5F3FC', '#DDD6FE'],
      glowCount: 9,
      glowColors: ['#5EEAD4', '#A5F3FC', '#DDD6FE', '#F0ABFC'],
    })}
  </g>
</svg>
`

const light = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F4F8FF"/>
      <stop offset="0.35" stop-color="#E7EEFB"/>
      <stop offset="0.68" stop-color="#DFE8F7"/>
      <stop offset="1" stop-color="#F1F5FC"/>
    </linearGradient>
    <radialGradient id="cyan"><stop offset="0" stop-color="#0891B2" stop-opacity="0.24"/><stop offset="0.5" stop-color="#0891B2" stop-opacity="0.10"/><stop offset="1" stop-color="#0891B2" stop-opacity="0"/></radialGradient>
    <radialGradient id="violet"><stop offset="0" stop-color="#7C3AED" stop-opacity="0.20"/><stop offset="0.5" stop-color="#7C3AED" stop-opacity="0.09"/><stop offset="1" stop-color="#7C3AED" stop-opacity="0"/></radialGradient>
    <radialGradient id="rose"><stop offset="0" stop-color="#DB2777" stop-opacity="0.13"/><stop offset="0.55" stop-color="#DB2777" stop-opacity="0.06"/><stop offset="1" stop-color="#DB2777" stop-opacity="0"/></radialGradient>
    <radialGradient id="white"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.60"/><stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#22D3EE" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#A78BFA" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g transform="rotate(-22 800 500)" opacity="0.9">
    <rect x="-240" y="330" width="2080" height="280" fill="url(#band)"/>
  </g>
  <ellipse cx="380" cy="180" rx="620" ry="470" fill="url(#cyan)"/>
  <ellipse cx="1270" cy="160" rx="600" ry="440" fill="url(#violet)"/>
  <ellipse cx="1060" cy="860" rx="680" ry="460" fill="url(#rose)"/>
  <ellipse cx="150" cy="850" rx="520" ry="400" fill="url(#cyan)" opacity="0.6"/>
  <ellipse cx="700" cy="330" rx="420" ry="300" fill="url(#white)"/>
  <g filter="url(#soft)" opacity="0.55">
    <ellipse cx="720" cy="320" rx="680" ry="95" fill="#22D3EE" opacity="0.14" transform="rotate(-14 720 320)"/>
    <ellipse cx="1000" cy="700" rx="700" ry="80" fill="#A78BFA" opacity="0.13" transform="rotate(-8 1000 700)"/>
  </g>
  <g>
    ${stars({
      count: 120,
      seed: 20261115,
      colors: ['#3B4A7A', '#0891B2', '#7C3AED', '#64748B'],
      glowCount: 0,
      glowColors: [],
      rMin: 0.5,
      rMax: 1.6,
      opacity: [0.22, 0.62],
    })}
  </g>
</svg>
`

const b64 = (text) => Buffer.from(text, 'utf8').toString('base64')

writeFileSync(join(HERE, 'wallpaper-dark.svg'), dark)
writeFileSync(join(HERE, 'wallpaper-light.svg'), light)
writeFileSync(join(HERE, 'wallpaper.data.mjs'), `/** Generated by design/generate-wallpaper.mjs — do not edit by hand. */
export const BACKDROP_DARK = 'data:image/svg+xml;base64,${b64(dark)}'
export const BACKDROP_LIGHT = 'data:image/svg+xml;base64,${b64(light)}'
`)
console.log('wrote wallpaper-dark.svg', dark.length, 'bytes')
console.log('wrote wallpaper-light.svg', light.length, 'bytes')
console.log('wrote wallpaper.data.mjs (base64', b64(dark).length + b64(light).length, 'bytes)')
