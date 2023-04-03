#! /usr/bin/env node
import * as p from '@clack/prompts'
import { removeOldDependencies } from './helpers/removeOldDependencies'
import { addVue2Deps } from './helpers/addVue2Deps'
import { runCommand } from './helpers/runCommand'
import pc from 'picocolors'
import { addVueCompatDeps } from './helpers/addVueCompatDeps'
import { addViteConfig } from './helpers/addViteConfig'
import { type Answers, type Language, type MigrationMode, type PackageManager } from './types'
import { handleIndexFile } from './helpers/handleIndexFile'
import { handleRunScripts } from './helpers/handleRunScripts'
import { handleEnvFiles } from './helpers/handleEnvFiles'

const answers: Answers = {
  mode: 'vue2Vite',
  language: 'js',
  packageManager: 'npm',
  installChoice: false
}

const jobsDone = {
  removeOldDependencies: false,
  addVue2Deps: false,
  addVueCompatDeps: false,
  addViteConfig: false,
  handleIndexFile: false,
  handleRunScripts: false,
  handleEnvFiles: false
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
          hint: 'Play safe! Stay on Vue 2, replace Webpack with Vite.'
        },
        {
          value: 'vue3CompatVite',
          label: 'Vue 2 with Vue CLI -> Vue 3 Migration build + Vite',
          hint: 'Recommended. Add Vue 3 migration build and slowly migrate the project to Vue 3 later.'
        },
        {
          value: 'vue3Vite',
          label: 'Vue 2 with Vue CLI -> Vue 3 + Vite',
          hint: 'Feeling adventurous? Migrate to Vue 3 right away!'
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
  installChoice: async () => {
    const response = await p.select({
      message: 'Do you want vue-migrate to automatically install new dependencies after?',
      options: [
        {
          value: true,
          label: 'Yes',
          hint: `vue-migrate will run '${answers.packageManager} install' for you.`
        },
        {
          value: false,
          label: 'No',
          hint: 'You can install the dependencies yourself later.'
        }
      ]
    })

    answers.installChoice = response as boolean
  },
  wait: async () => {
    if (Object.values(answers).every((a) => typeof a !== 'symbol' && a !== '')) {
      const s = p.spinner()
      s.start('Updating files and dependencies...')

      const { ok: depsStatus } = await removeOldDependencies()
      jobsDone.removeOldDependencies = depsStatus

      if (answers.mode === 'vue2Vite') {
        await addVue2Deps()
      } else if (answers.mode === 'vue3CompatVite') {
        await addVueCompatDeps()
      }
      // add vite.config.js or .ts, depending on selected language
      console.log('add vite config next')
      await addViteConfig(answers.mode, answers.language)
      // move index.html file and replace webpack references, and add script tag
      console.log('handle index file next')
      await handleIndexFile(answers.language)
      // update the scripts in package.json
      console.log('handle run scripts next')
      await handleRunScripts()
      // update environment variables
      console.log('handle env files next')
      await handleEnvFiles()
      // TODO cleanup magic comments from router
      if (answers.installChoice) {
        await runCommand(packageManagerCommands[answers.packageManager].install)
        if (answers.mode === 'vue2Vite') {
          await runCommand(packageManagerCommands[answers.packageManager].eslint)
        }
      }
      s.stop('Updated files and installed new dependencies.')
      p.outro(`The boring part of migration complete. Please check the migration guide for further steps: https://v3-migration.vuejs.org/
      You may need to update some dependencies manually.
     Also, check your scripts in package.json and make sure they work as expected.`)
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
