import * as fs from 'fs'

export async function getFile (fileName: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(process.cwd() + fileName, 'utf8')
      resolve(file)
    } catch (e) {
      reject(new Error('File not found'))
    }
  })
}

export async function saveFile (fileName: string, fileContents: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(process.cwd() + fileName, fileContents)
      resolve('OK')
    } catch (e) {
      reject(e)
    }
  })
}

export async function removeFile (fileName: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    try {
      // check if file exists
      if (fs.existsSync(process.cwd() + fileName)) {
        fs.unlinkSync(process.cwd() + fileName)
        resolve('OK')
      }
    } catch (e) {
      reject(e)
    }
  })
}

export async function copyFile (source: string, destination: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    try {
      fs.copyFileSync(process.cwd() + source, process.cwd() + destination)
      resolve('OK')
    } catch (e) {
      reject(e)
    }
  })
}
