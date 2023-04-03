import { getFile, saveFile } from './fileHelpers'
import * as fs from 'fs'

export async function handleEnvFiles (): Promise<void> {
  // get all .env files in root
  const envFiles = fs.readdirSync(process.cwd()).filter((file: string) => file.startsWith('.env'))

  if (envFiles.length > 0) {
    for (let i = 0; i < envFiles.length; i++) {
      const fileContents = await getFile(`/${envFiles[i]}`)
      const newFileContent = fileContents.replace(/VUE_APP_/g, 'VITE_')
      await saveFile(`/${envFiles[i]}`, newFileContent)
    }
  }
}
