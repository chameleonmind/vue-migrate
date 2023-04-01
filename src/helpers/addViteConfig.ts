import * as fs from 'fs'
import { viteConfigJsVue2, viteConfigVueCompat, viteConfigVue3 } from './fileContents'
import { saveFile } from './fileHelpers'
import { type Language, type MigrationMode } from '../types'

export async function addViteConfig (mode: MigrationMode = 'vue2Vite', language: Language = 'js'): Promise<void> {
  const existingViteConfig = fs.existsSync(`${process.cwd()}/vite.config.${language}`)
  if (!existingViteConfig) {
    if (mode === 'vue2Vite') {
      await saveFile(`/vite.config.${language}`, viteConfigJsVue2)
    } else if (mode === 'vue3CompatVite') {
      await saveFile(`/vite.config.${language}`, viteConfigVueCompat)
    } else if (mode === 'vue3Vite') {
      await saveFile(`/vite.config.${language}`, viteConfigVue3)
    } else {
      throw new Error('Migration mode not supported')
    }
  } else {
    console.log('Vite config already exists, skipping...')
  }
}
