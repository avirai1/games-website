import { useEffect, useMemo, useState } from 'react'

const WORDS = [
  'crane','robot','lemon','grape','chair',
  'mango','pearl','tiger','blast','cider'
]

function dayKeyUTC(d = new Date()) {
  // YYYY-MM-DD in UTC so the puzzle is consistent for everyone
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayIndex() {
  // days since epoch
  const todayDays = Math.floor(Date.now() / 86400000)
  return todayDays % WORDS.length
}

function shuffle(s: string) {
  const arr = s.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // avoid unscrambled showing up by accident
  if (arr.join('') === s) return shuffle(s)
  return arr.join('')
}

export default function WordLink() {
  const key = dayKeyUTC()
  const answer = useMemo(() => WORDS[todayIndex()], [])
  const scrambled = useMemo(() => shuffle(answer), [answer])

  const storageKey = `wordlink:${key}`
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [solved, setSolved] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'solved') {
      setSolved(true)
      setMessage('Already solved today—nice!')
    }
  }, [storageKey])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const g = guess.trim().toLowerCase()
    if (!g) return
    setAttempts(a => a + 1)
    if (g === answer) {
      setSolved(true)
      localStorage.setItem(storageKey, 'solved')
      setMessage('Correct! See you tomorrow 👑')
    } else {
      setMessage('Not quite. Try again!')
    }
  }

  function copyResult() {
    const text = `WordLink ${key}: solved in ${attempts} ${attempts === 1 ? 'try' : 'tries'}`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="card p-6">
      <div className="mb-4">
        <div className="text-sm text-neutral-500">Daily Anagram</div>
        <h2 className="text-xl font-semibold">Unscramble the word</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {scrambled.split('').map((ch, i) => (
          <span
            key={i}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-lg font-semibold"
          >
            {ch.toUpperCase()}
          </span>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          maxLength={answer.length}
          disabled={solved}
          placeholder={`${answer.length}-letter word`}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          disabled={solved}
          className={`rounded-xl px-4 py-2 text-white transition ${
            solved ? 'bg-neutral-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {solved ? 'Solved' : 'Check'}
        </button>
      </form>

      <div className="text-sm text-neutral-600 mb-4">
        {message || 'Tip: you can submit multiple guesses.'}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <div>Attempts: <span className="font-medium text-neutral-700">{attempts}</span></div>
        {solved && (
          <button onClick={copyResult} className="underline hover:no-underline">
            Copy result
          </button>
        )}
      </div>
    </div>
  )
}
