#! /usr/bin/env node
import * as p from '@clack/prompts'
import { removeOldDependencies } from './helpers/removeOldDependencies'
import { addVue2Deps } from './helpers/addVue2Deps'
// import { runCommand } from './helpers/runCommand'
import pc from 'picocolors'
import { addVueCompatDeps } from './helpers/addVueCompatDeps'
import { addViteConfig } from './helpers/addViteConfig'
import { type Answers, type Language, type MigrationMode, type PackageManager } from './types'
import { handleIndexFile } from './helpers/handleIndexFile'
import { handleRunScripts } from './helpers/handleRunScripts'
import { handleEnvFiles } from './helpers/handleEnvFiles'
import { addVue3Deps } from './helpers/addVue3Deps'

const answers: Answers = {
  mode: 'vue2Vite',
  language: 'js',
  packageManager: 'npm',
  installChoice: false
}

const jobsDone = {
  removeOldDependencies: false,
  addVue2Deps: false,
  addVue3Deps: false,
  addVueCompatDeps: false,
  addViteConfig: false,
  handleIndexFile: false,
  handleRunScripts: false,
  handleEnvFiles: false
}

// const packageManagerCommands: Record<string, any> = {
//   npm: {
//     install: 'npm install'
//   },
//   yarn: {
//     install: 'yarn install'
//   },
//   pnpm: {
//     install: 'pnpm install'
//   }
// }

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
  // packageManager: async () => {
  //   const response = await p.select({
  //     message: 'Which package manager do you use?',
  //     options: [
  //       {
  //         value: 'npm',
  //         label: 'npm'
  //       },
  //       {
  //         value: 'yarn',
  //         label: 'yarn'
  //       },
  //       {
  //         value: 'pnpm',
  //         label: 'pnpm'
  //       }
  //     ]
  //   })
  //
  //   answers.packageManager = response as PackageManager
  //   if (p.isCancel(response)) {
  //     abortMigration()
  //   }
  // },
  // installChoice: async () => {
  //   const response = await p.select({
  //     message: 'Do you want vue-migrate to automatically install new dependencies after?',
  //     options: [
  //       {
  //         value: true,
  //         label: 'Yes',
  //         hint: `vue-migrate will run '${answers.packageManager} install' for you.`
  //       },
  //       {
  //         value: false,
  //         label: 'No',
  //         hint: 'You can install the dependencies yourself later.'
  //       }
  //     ]
  //   })
  //
  //   answers.installChoice = response as boolean
  // },
  wait: async () => {
    if (Object.values(answers).every((a) => typeof a !== 'symbol' && a !== '')) {
      const s = p.spinner()
      s.start('Updating files and dependencies...')

      const { ok: depsStatus } = await removeOldDependencies()
      jobsDone.removeOldDependencies = depsStatus

      if (answers.mode === 'vue2Vite') {
        const { ok: depsStatus } = await addVue2Deps()
        jobsDone.addVue2Deps = depsStatus
      } else if (answers.mode === 'vue3CompatVite') {
        const { ok: depsStatus } = await addVueCompatDeps()
        jobsDone.addVueCompatDeps = depsStatus
      } else if (answers.mode === 'vue3Vite') {
        const { ok: depsStatus } = await addVue3Deps()
        jobsDone.addVue3Deps = depsStatus
      }
      // add vite.config.js or .ts, depending on selected language
      const { ok: configStatus } = await addViteConfig(answers.mode, answers.language)
      jobsDone.addViteConfig = configStatus
      // move index.html file and replace webpack references, and add script tag
      const { ok: indexStatus } = await handleIndexFile(answers.language)
      jobsDone.handleIndexFile = indexStatus
      // update the scripts in package.json
      const { ok: scriptsStatus } = await handleRunScripts()
      jobsDone.handleRunScripts = scriptsStatus
      // update environment variables
      const { ok: envStatus } = await handleEnvFiles()
      jobsDone.handleEnvFiles = envStatus
      // if (answers.installChoice) {
      //   await runCommand(packageManagerCommands[answers.packageManager].install)
      // }
      s.stop('Updated files and added new dependencies.')
      p.note(`All done. Don't forget to delete node_modules and package.json and run install command.
You may need to update some dependencies manually.
Here's what was changed:
- Removed old dependencies: ${jobsDone.removeOldDependencies ? pc.green('✓') : pc.red('✗')}
- Added new dependencies: ${jobsDone.addVue2Deps || jobsDone.addVueCompatDeps || jobsDone.addVue3Deps ? pc.green('✓') : pc.red('✗')}
- Added vite.config.js: ${jobsDone.addViteConfig ? pc.green('✓') : pc.red('✗')}
- Updated index.html: ${jobsDone.handleIndexFile ? pc.green('✓') : pc.red('✗')}
- Updated scripts in package.json: ${jobsDone.handleRunScripts ? pc.green('✓') : pc.red('✗')}
- Updated environment variables: ${jobsDone.handleEnvFiles ? pc.green('✓') : pc.red('✗')}
Also, check your scripts in package.json and make sure they work as expected.`
      )
      p.outro('The boring part of migration complete. Please check the migration guide for further steps: https://v3-migration.vuejs.org/')
    }
  }
},
{
  // On Cancel callback that wraps the group
  // So if the user cancels one of the prompts in the group this function will be called
  onCancel: () => {
    abortMigration()
  }
})
