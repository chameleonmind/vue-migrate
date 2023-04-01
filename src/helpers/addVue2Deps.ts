import { getFile, saveFile } from './fileHelpers'

export async function addVue2Deps (): Promise<void> {
  const file = await getFile('/package.json')
  const parsedPackage = JSON.parse(file)

  const newPackage = { ...parsedPackage }
  newPackage.dependencies = {
    ...parsedPackage.dependencies,
    '@vitejs/plugin-vue': '^1.6.1',
    vite: '^2.5.4'
  }

  await saveFile('/package.json', JSON.stringify(newPackage, null, 2))
}
