import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { distDirectory } from './build-utils.mjs'

await rm(resolve(distDirectory, 'server'), {
  recursive: true,
  force: true,
})
