#! /usr/bin/env node
import * as p from '@clack/prompts'
import { removeOldDependencies } from './helpers/removeOldDependencies'
import { addVue2Deps } from './helpers/addVue2Deps'
import { runCommand } from './helpers/runCommand'
import pc from 'picocolors'
import { addVueCompatDeps } from './helpers/addVueCompatDeps'
import { addViteConfig } from './helpers/addViteConfig'
import { removeFile } from './helpers/fileHelpers'
import { type Answers, type Language, type MigrationMode, type PackageManager } from './types'

const answers: Answers = {
  mode: 'vue2Vite',
  language: 'js',
  packageManager: 'npm'
}

const packageManagerCommands: Record<string, any> = {
  npm: {
    install: 'npm install',
    eslint: 'npm install -D eslint@8 eslint-plugin-vue@8'
  },
  yarn: {
    install: 'yarn install',
    eslint: 'yarn add -D eslint@8 eslint-plugin-vue@8'
  },
  pnpm: {
    install: 'pnpm install',
    eslint: 'pnpm add -D eslint@8 eslint-plugin-vue@8'
  }
}

function abortMigration (): void {
  p.outro(pc.bgRed('Migration aborted...'))
  process.exit(0)
}

await p.group({
  intro: () => {
    console.clear()
    p.intro(pc.bgGreen('Welcome to the Vue migration tool'))
  },
  mode: async () => {
    const response = await p.select({
      message: 'Select a migration mode',
      options: [
        {
          value: 'vue2Vite',
          label: 'Vue 2 with Vue CLI -> Vue 2 + Vite',
          hint: 'Stay on Vue 2, replace Webpack with Vite'
        },
        {
          value: 'vue3CompatVite',
          label: 'Vue 2 with Vue CLI -> Vue 3 Migration build + Vite',
          hint: 'Add @vue/compat version and Vite'
        },
        {
          value: 'vue3Vite',
          label: 'Vue 2 with Vue CLI -> Vue 3 + Vite',
          hint: 'Migrate to the newest Vue 3 version and Vite'
        }
      ]
    })

    answers.mode = response as MigrationMode
    if (p.isCancel(response)) {
      abortMigration()
    }
  },
  language: async () => {
    const response = await p.select({
      message: 'Do you use JavaScript or TypeScript?',
      options: [
        {
          value: 'ts',
          label: 'TypeScript'
        },
        {
          value: 'js',
          label: 'JavaScript'
        }
      ]
    })

    answers.language = response as Language
    if (p.isCancel(response)) {
      abortMigration()
    }
  },
  packageManager: async () => {
    const response = await p.select({
      message: 'Which package manager do you use?',
      options: [
        {
          value: 'npm',
          label: 'npm'
        },
        {
          value: 'yarn',
          label: 'yarn'
        },
        {
          value: 'pnpm',
          label: 'pnpm'
        }
      ]
    })

    answers.packageManager = response as PackageManager
    if (p.isCancel(response)) {
      abortMigration()
    }
  },
  wait: async () => {
    if (Object.values(answers).every((a) => typeof a !== 'symbol' && a !== '')) {
      const s = p.spinner()
      s.start('Updating files and dependencies...')
      await removeOldDependencies()
      if (answers.mode === 'vue2Vite') {
        await addVue2Deps()
      } else if (answers.mode === 'vue3CompatVite') {
        await addVueCompatDeps()
      }
      // add vite.config.js or .ts, depending on selected language
      await addViteConfig(answers.mode, answers.language)
      // remove vue.config.js
      await removeFile(`/vue.config.${answers.language}`)
      // TODO move index.html file and replace webpack references, and add script tag
      // TODO update the scripts in package.json
      // TODO update environment variables
      // TODO cleanup magic comments from router
      await runCommand(packageManagerCommands[answers.packageManager].install)
      if (answers.mode === 'vue2Vite') {
        await runCommand(packageManagerCommands[answers.packageManager].eslint)
      }
      s.stop('Updated files and installed new dependencies.')
      p.outro('Migration complete. Please check the migration guide for further steps.')
    }
  }
},
{
  // On Cancel callback that wraps the group
  // So if the user cancels one of the prompts in the group this function will be called
  onCancel: ({ results }) => {
    abortMigration()
  }
})
