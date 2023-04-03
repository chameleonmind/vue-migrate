import { getFile, saveFile } from './fileHelpers'

export async function addVueCompatDeps (): Promise<void> {
  const file = await getFile('/package.json')
  const parsedPackage = JSON.parse(file)

  const newPackage = { ...parsedPackage }
  newPackage.dependencies = {
    ...parsedPackage.dependencies,
    vue: '^3.2.25',
    '@vue/compat': '^3.2.47'
  }

  newPackage.devDependencies = {
    ...parsedPackage.devDependencies,
    '@vitejs/plugin-vue': '^4.0.0'
    // '@vue/compiler-sfc': '^3.1.0'
  }

  await saveFile('/package.json', JSON.stringify(newPackage, null, 2))
}
