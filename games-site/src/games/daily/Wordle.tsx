import { useEffect, useMemo, useState } from 'react'
import answersRaw from './WordleWordLists/answers.txt?raw'
import { loadAllowedFor } from './WordleWordLists/loader'

type LetterEval = 'correct' | 'present' | 'absent'
type GameStatus = 'playing' | 'won' | 'lost'

// Parse answers (one 5-letter lowercase word per line)
const ANSWERS = answersRaw
  .split(/\r?\n/)
  .map(w => w.trim().toLowerCase())
  .filter(w => w.length === 5 && /^[a-z]+$/.test(w))

function dayKeyUTC(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function todayIndex() {
  const days = Math.floor(Date.now() / 86400000)
  return ANSWERS.length ? (days % ANSWERS.length) : 0
}

function evaluateGuess(guess: string, answer: string): LetterEval[] {
  const res: LetterEval[] = Array(5).fill('absent')
  const ansArr = answer.split('')
  const used = Array(5).fill(false)
  // pass 1: correct
  for (let i = 0; i < 5; i++) {
    if (guess[i] === ansArr[i]) { res[i] = 'correct'; used[i] = true }
  }
  // pass 2: present
  for (let i = 0; i < 5; i++) {
    if (res[i] === 'correct') continue
    const ch = guess[i]
    let found = -1
    for (let j = 0; j < 5; j++) {
      if (!used[j] && ansArr[j] === ch) { found = j; break }
    }
    if (found >= 0) { res[i] = 'present'; used[found] = true }
  }
  return res
}
function classForEval(e: LetterEval | null) {
  if (!e) return 'border-neutral-300 text-neutral-900 bg-white'
  if (e === 'correct') return 'bg-green-500 border-green-500 text-white'
  if (e === 'present') return 'bg-yellow-500 border-yellow-500 text-white'
  return 'bg-neutral-400 border-neutral-400 text-white'
}
function upgradeKeyStatus(prev: Record<string, LetterEval>, guess: string, evals: LetterEval[]) {
  const rank = { absent: 0, present: 1, correct: 2 } as const
  const out = { ...prev }
  for (let i = 0; i < 5; i++) {
    const ch = guess[i]; const e = evals[i]; const cur = out[ch]
    if (!cur || rank[e] > rank[cur]) out[ch] = e
  }
  return out
}

export default function Wordle() {
  const key = dayKeyUTC()
  const answer = useMemo(() => (ANSWERS[todayIndex()] ?? 'crane'), [])
  const [guesses, setGuesses] = useState<string[]>([])
  const [evals, setEvals] = useState<LetterEval[][]>([])
  const [current, setCurrent] = useState('')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [message, setMessage] = useState<string>('')
  const [keys, setKeys] = useState<Record<string, LetterEval>>({})
  const [revealRow, setRevealRow] = useState<number | null>(null) // which row to flip

  // Load saved state for today
  useEffect(() => {
    const raw = localStorage.getItem(`wordle:${key}`)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        if (Array.isArray(data.guesses)) setGuesses(data.guesses)
        if (Array.isArray(data.evals)) setEvals(data.evals)
        if (data.status === 'won' || data.status === 'lost') setStatus(data.status)
        if (Array.isArray(data.evals) && Array.isArray(data.guesses)) {
          let ks: Record<string, LetterEval> = {}
          for (let r = 0; r < data.guesses.length; r++) {
            ks = upgradeKeyStatus(ks, data.guesses[r], data.evals[r])
          }
          setKeys(ks)
        }
      } catch {}
    }
  }, [key])

  // Persist progress
  useEffect(() => {
    localStorage.setItem(`wordle:${key}`, JSON.stringify({ guesses, evals, status }))
  }, [guesses, evals, status, key])

  // Clear the reveal flag after the stagger finishes
  useEffect(() => {
    if (revealRow === null) return
    const total = 5 * 120 + 700 // 5 tiles * 120ms stagger + headroom
    const t = setTimeout(() => setRevealRow(null), total)
    return () => clearTimeout(t)
  }, [revealRow])

  // Prefetch dict chunk for the first typed letter
  useEffect(() => {
    const first = current[0]
    if (first && /^[a-zA-Z]$/.test(first)) {
      loadAllowedFor(first.toLowerCase(), answer).catch(() => {})
    }
  }, [current, answer])

  function setFlash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 1600)
  }

  // async to allow dictionary load
  async function commitGuess(g: string) {
    if (g.length !== 5) return setFlash('Need 5 letters')
    if (!/^[a-zA-Z]{5}$/.test(g)) return setFlash('Letters only')
    const guess = g.toLowerCase()

    const first = guess[0]
    const allowed = await loadAllowedFor(first, answer)
    if (allowed.size > 0 && !allowed.has(guess)) {
      setFlash('Not in word list')
      return
    }

    const rowEval = evaluateGuess(guess, answer)
    const newGuesses = [...guesses, guess]
    const newEvals = [...evals, rowEval]
    setGuesses(newGuesses)
    setEvals(newEvals)
    setKeys((s) => upgradeKeyStatus(s, guess, rowEval))
    setCurrent('')
    setRevealRow(newGuesses.length - 1) // trigger flip for this row

    if (guess === answer) {
      setStatus('won'); setFlash('Correct! 🎉')
    } else if (newGuesses.length >= 6) {
      setStatus('lost'); setFlash(`Answer: ${answer.toUpperCase()}`)
    }
  }

  // Physical keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (status !== 'playing') return
      const k = e.key
      if (k === 'Enter') return void commitGuess(current)
      if (k === 'Backspace') return setCurrent((c) => c.slice(0, -1))
      if (/^[a-zA-Z]$/.test(k)) setCurrent((c) => (c.length < 5 ? (c + k).toLowerCase() : c))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, status])

  function onKeyClick(k: string) {
    if (status !== 'playing') return
    if (k === 'ENTER') return void commitGuess(current)
    if (k === 'DEL') return setCurrent((c) => c.slice(0, -1))
    if (/^[A-Z]$/.test(k)) setCurrent((c) => (c.length < 5 ? (c + k.toLowerCase()) : c))
  }

  function share() {
    const lines = evals.map((row) =>
      row.map((e) => (e === 'correct' ? '🟩' : e === 'present' ? '🟨' : '⬛')).join('')
    )
    const tries = status === 'won' ? guesses.length : 'X'
    const text = `Wordle — ${key}\n${tries}/6\n${lines.join('\n')}`
    navigator.clipboard.writeText(text).then(() => setFlash('Copied to clipboard'))
  }

  const keyboardRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['ENTER', ...'ZXCVBNM'.split(''), 'DEL'],
  ]

  return (
    <div className="space-y-6">
      <div className="text-sm text-neutral-600">Guess the 5-letter word in 6 tries.</div>

      {/* Board (tighter gaps) */}
      <div className="grid gap-1">
        {Array.from({ length: 6 }).map((_, r) => {
          const guess = guesses[r] || (r === guesses.length ? current : '')
          const rowEval = evals[r] || []
          const isRevealing = revealRow === r && rowEval.length === 5
          return (
            <div key={r} className="grid grid-cols-5 gap-1">
              {Array.from({ length: 5 }).map((__, c) => {
                const ch = guess[c]?.toUpperCase() ?? ''
                const e = rowEval[c] ?? (r < guesses.length ? 'absent' : null)
                return (
                  <div
                    key={c}
                    className={`h-12 w-12 rounded-xl border grid place-items-center text-lg font-bold wordle-tile ${classForEval(e)} ${isRevealing ? 'wordle-flip' : ''}`}
                    style={isRevealing ? { animationDelay: `${c * 120}ms` } : undefined}
                  >
                    {ch}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Message */}
      {message && (
        <div className="text-sm text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 inline-block">
          {message}
        </div>
      )}

      {/* Keyboard */}
      <div className="space-y-2">
        {keyboardRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((k) => {
              const lower = k.length === 1 ? k.toLowerCase() : k
              const state = keys[lower]
              const color =
                state === 'correct'
                  ? 'bg-green-500 text-white border-green-500'
                  : state === 'present'
                  ? 'bg-yellow-500 text-white border-yellow-500'
                  : state === 'absent'
                  ? 'bg-neutral-400 text-white border-neutral-400'
                  : 'bg-white text-neutral-800 border-neutral-300'
              const width = k === 'ENTER' || k === 'DEL' ? 'w-16' : 'w-9'
              return (
                <button
                  key={k}
                  onClick={() => onKeyClick(k)}
                  className={`h-10 ${width} rounded-lg border text-sm font-medium ${color}`}
                >
                  {k === 'DEL' ? '⌫' : k}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3">
        {status !== 'playing' && (
          <div className="text-sm text-neutral-600">
            {status === 'won' ? 'Solved — see you tomorrow!' : `Answer: ${answer.toUpperCase()}`}
          </div>
        )}
        {(status === 'won' || status === 'lost') && (
          <button
            onClick={share}
            className="ml-auto inline-flex items-center justify-center rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
          >
            Share Result
          </button>
        )}
      </div>
    </div>
  )
}
