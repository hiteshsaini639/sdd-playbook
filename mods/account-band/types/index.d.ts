export type Feature = { name: string; done: number; total: number }

export type Window = { kind: string; percentUsed: number; resetsAt?: string }

// One account's latest usage, as a session on it last measured it. claude-pick
// reads the same file, so a field renamed here is renamed there.
export type Reading = { account: string; configDir: string | null; readAt: string; windows: Window[] }

// How full an account is: its busier window, or null with no reading yet.
export type Room = { account: string; fullness: number | null }

declare module 'claude-code' {
  interface PluginState {
    'account-band': { feature: Feature | null; rooms: Room[] }
  }
}
