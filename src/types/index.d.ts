export type MigrationMode = 'vue2Vite' | 'vue3CompatVite' | 'vue3Vite'
export type PackageManager = 'npm' | 'yarn' | 'pnpm'
export type Language = 'js' | 'ts'
export interface Answers {
  mode: MigrationMode
  language: Language
  packageManager: PackageManager
  installChoice: boolean
}
