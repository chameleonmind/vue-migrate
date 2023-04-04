import { getFile, saveFile } from './fileHelpers'
import * as fs from 'fs'

export async function handleEnvFiles (): Promise<{ ok: boolean }> {
  // get all .env files in root
  const envFiles = fs.readdirSync(process.cwd()).filter((file: string) => file.startsWith('.env'))

  if (envFiles.length > 0) {
    for (const element of envFiles) {
      const fileContents = await getFile(`/${element}`)
      const newFileContent = fileContents.replace(/VUE_APP_/g, 'VITE_')
      await saveFile(`/${element}`, newFileContent)
    }

    return {
      ok: true
    }
  }

  return {
    ok: false
  }
}
