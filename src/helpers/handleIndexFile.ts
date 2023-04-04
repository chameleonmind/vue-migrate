import * as fs from 'fs'
import { copyFile, getFile, removeFile, saveFile } from './fileHelpers'
import { type Language } from '../types'
import { sleep } from './utils'

export async function handleIndexFile (language: Language = 'js'): Promise<{ ok: boolean }> {
  // check if index.html exists
  if (fs.existsSync(process.cwd() + '/public/index.html')) {
    // make a backup of index.html
    await copyFile('/public/index.html', '/public/index.html.bak')
    // copy index.html to root
    await copyFile('/public/index.html', '/index.html')
    // remove index.html from public
    await removeFile('/public/index.html')

    const fileContents = await getFile('/index.html')
    const newFileContent = fileContents
      .replace(/<%= BASE_URL %>/g, '/')
      .replace(/<%=.%>/g, 'Put your content here')
      .replace(/<\/body>/g, `<script type="module" src="/src/main.${language}"></script>\n</body>`)

    await saveFile('/index.html', newFileContent)

    return {
      ok: true
    }
  } else {
    await sleep(1000)

    return {
      ok: false
    }
  }
}
