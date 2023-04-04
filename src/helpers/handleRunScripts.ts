import { getFile, saveFile } from './fileHelpers'

export async function handleRunScripts (): Promise<{ ok: boolean }> {
  const packageJson = await getFile('/package.json')
  const parsedPackage = JSON.parse(packageJson)

  const newPackage = { ...parsedPackage }

  const scripts = { ...parsedPackage.scripts }

  const newScripts = Object.entries(scripts).reduce((acc: Record<string, string>, [key, value]: [string, string]) => {
    if (value.includes('vue-cli-service test:unit')) {
      acc[key] = value.replace('vue-cli-service test:unit', 'jest')
    } else if (value.includes('vue-cli-service')) {
      acc[key] = value.replace('vue-cli-service', 'vite')
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  newScripts.dev = 'vite'

  newPackage.scripts = newScripts

  await saveFile('/package.json', JSON.stringify(newPackage, null, 2))

  return {
    ok: true
  }
}
