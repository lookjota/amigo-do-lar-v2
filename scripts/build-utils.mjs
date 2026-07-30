import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

export const projectRoot = resolve(import.meta.dirname, '..')
export const distDirectory = resolve(projectRoot, 'dist')
export const serverEntryPath = resolve(
  distDirectory,
  'server',
  'entry-server.js',
)

export async function loadServerEntry() {
  return import(`${pathToFileURL(serverEntryPath).href}?time=${Date.now()}`)
}

export function getRobotsContent(metadata) {
  const directives = []

  if (metadata.robots?.index !== undefined) {
    directives.push(metadata.robots.index ? 'index' : 'noindex')
  }

  if (metadata.robots?.follow !== undefined) {
    directives.push(metadata.robots.follow ? 'follow' : 'nofollow')
  }

  return directives.join(', ')
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
