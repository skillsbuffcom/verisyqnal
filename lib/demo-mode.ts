import type { NextRequest } from 'next/server'

export const DEMO_MODE_HEADER = 'x-demo-mode'
export const DEMO_MODE_STORAGE_KEY = 'verisyqnal-demo-mode'

export function isDemoModeRequest(req: NextRequest) {
  return req.headers.get(DEMO_MODE_HEADER) === '1'
}
