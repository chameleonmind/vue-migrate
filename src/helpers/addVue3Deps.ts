import { getFile, saveFile } from './fileHelpers'
import { replaceDependencies } from './dependencyDictionary'

export async function addVue3Deps (): Promise<{ ok: boolean }> {
  const file = await getFile('/package.json')
  const parsedPackage = JSON.parse(file)

  const newPackage = { ...parsedPackage }
  newPackage.dependencies = {
    ...parsedPackage.dependencies,
    vue: '^3.2.25'
  }

  newPackage.devDependencies = {
    ...parsedPackage.devDependencies,
    '@vitejs/plugin-vue': '^4.0.0',
    eslint: '^8.37.0',
    'eslint-plugin-vue': '^8.7.1'
  }

  newPackage.dependencies = replaceDependencies(newPackage.dependencies)
  newPackage.devDependencies = replaceDependencies(newPackage.devDependencies)

  await saveFile('/package.json', JSON.stringify(newPackage, null, 2))
  return {
    ok: true
  }
}
