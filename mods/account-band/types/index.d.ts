export type Feature = { name: string; done: number; total: number }

declare module 'claude-code' {
  interface PluginState {
    'account-band': { feature: Feature | null }
  }
}
