import { exec } from 'child_process'

export async function runCommand (cmd: string): Promise<any> {
  const child = exec(cmd, (err) => {
    if (err !== null) console.error(err)
  })
  if (child !== null) {
    child?.stderr?.pipe(process.stderr)
    child?.stdout?.pipe(process.stdout)
    await new Promise((resolve) => child.on('close', resolve))
  }
}
