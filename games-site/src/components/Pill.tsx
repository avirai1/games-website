import { ReactNode } from 'react'

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white">
      {children}
    </span>
  )
}
