// Lazy-load allowed word lists split by first letter using Vite's glob imports.
const loaders = import.meta.glob('./allowed-*.txt', { as: 'raw' })

const cache: Record<string, Set<string>> = {}

/**
 * Load the allowed-<letter>.txt file and return a Set of words.
 * - letter: first character of the guess (a-z)
 * - answer: today's answer (so we can always allow it even if missing)
 */
export async function loadAllowedFor(letter: string, answer?: string): Promise<Set<string>> {
  const l = (letter || '').toLowerCase()
  if (!l || l < 'a' || l > 'z') {
    // fallback: empty set; caller may choose to allow anything
    return new Set(answer && answer[0] === l ? [answer] : [])
  }

  if (cache[l]) return cache[l]

  const path = `./allowed-${l}.txt`
  const loader = loaders[path]
  if (!loader) {
    // no file found for this letter
    const set = new Set<string>()
    if (answer && answer[0] === l) set.add(answer)
    cache[l] = set
    return set
  }

  const raw = await loader() // string with newline-separated words
  const set = new Set(
    raw
      .split(/\r?\n/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean)
  )

  // Always allow the answer if it starts with this letter
  if (answer && answer[0] === l) set.add(answer)

  cache[l] = set
  return set
}
