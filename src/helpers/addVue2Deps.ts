import { getFile, saveFile } from './fileHelpers'

export async function addVue2Deps (): Promise<{ ok: boolean }> {
  const file = await getFile('/package.json')
  const parsedPackage = JSON.parse(file)

  const newPackage = { ...parsedPackage }
  newPackage.dependencies = {
    ...parsedPackage.dependencies,
    '@vitejs/plugin-vue': '^1.6.1',
    vite: '^2.5.4',
    'vite-plugin-vue2': '^2.0.3',
    eslint: '^8.37.0',
    'eslint-plugin-vue': '^8.7.1'
  }

  await saveFile('/package.json', JSON.stringify(newPackage, null, 2))

  return {
    ok: true
  }
}
