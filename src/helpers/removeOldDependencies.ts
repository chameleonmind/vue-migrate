import { getFile, saveFile } from './fileHelpers'

function cleanupDependencies (dependencies: Record<string, string>): Record<string, string> {
  const toExclude = ['@vue/cli', 'webpack', 'webpack-cli', 'vue-template-compiler', 'sass-loader', 'node-sass', 'babel-eslint', 'core-js']
  return Object.keys(dependencies).reduce((acc: Record<string, string>, key) => {
    if (!toExclude.some((excluded) => key.includes(excluded))) {
      acc[key] = dependencies[key]
    }
    return acc
  }, {})
}
export async function removeOldDependencies (): Promise<any> {
  const file = await getFile('/package.json')
  const parsedPackage = JSON.parse(file)

  const newPackage = { ...parsedPackage }

  newPackage.dependencies = cleanupDependencies(parsedPackage.dependencies)
  newPackage.devDependencies = cleanupDependencies(parsedPackage.devDependencies)

  if (parsedPackage?.eslintConfig?.parserOptions?.parser === 'babel-eslint') {
    delete newPackage.eslintConfig.parserOptions.parser
    newPackage.eslintConfig.env.es2022 = true
  }

  await saveFile('/package.json', JSON.stringify(newPackage, null, 2))
  return {
    ok: true
  }
}
