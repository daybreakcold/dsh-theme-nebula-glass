/**
 * Build client.js from client.template.js + generated wallpaper data URIs.
 *
 * Run: node design/build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { BACKDROP_DARK, BACKDROP_LIGHT } from './wallpaper.data.mjs'

const template = readFileSync(new URL('./client.template.js', import.meta.url), 'utf8')
if (!template.includes('__BACKDROP_DARK__') || !template.includes('__BACKDROP_LIGHT__')) {
  throw new Error('template is missing the backdrop placeholders')
}
const output = template
  .replace('__BACKDROP_DARK__', () => BACKDROP_DARK)
  .replace('__BACKDROP_LIGHT__', () => BACKDROP_LIGHT)
writeFileSync(new URL('../client.js', import.meta.url), output)
console.log('built client.js:', output.length, 'bytes')
