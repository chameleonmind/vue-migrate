import * as fs from 'fs'
import { viteConfigJsVue2, viteConfigVueCompat, viteConfigVue3 } from './fileContents'
import { removeFile, saveFile } from './fileHelpers'
import { type Language, type MigrationMode } from '../types'
import { sleep } from './utils'

export async function addViteConfig (mode: MigrationMode = 'vue2Vite', language: Language = 'js'): Promise<{ ok: boolean }> {
  const existingViteConfig = fs.existsSync(`${process.cwd()}/vite.config.${language}`)
  if (!existingViteConfig) {
    if (mode === 'vue2Vite') {
      await saveFile(`/vite.config.${language}`, viteConfigJsVue2)
    } else if (mode === 'vue3CompatVite') {
      await saveFile(`/vite.config.${language}`, viteConfigVueCompat)
    } else if (mode === 'vue3Vite') {
      await saveFile(`/vite.config.${language}`, viteConfigVue3)
    } else {
      await sleep(1000)
    }
    await removeFile(`/vue.config.${language}`)
    return {
      ok: true
    }
  } else {
    await sleep(1000)

    return {
      ok: false
    }
  }
}
