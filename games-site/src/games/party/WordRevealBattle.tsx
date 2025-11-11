import { useMemo, useState } from 'react'

type Team = 'A' | 'B'
type GameStatus = 'playing' | 'won'

type Puzzle = {
  id: number
  clueWords: string[] // exactly 10 words
  answer: string
}

type Score = {
  A: number
  B: number
}

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    clueWords: [
      'animal', 'with', 'long', 'neck', 'spots',
      'eats', 'leaves', 'from', 'tall', 'trees',
    ],
    answer: 'giraffe',
  },
  {
    id: 2,
    clueWords: [
      'bright', 'object', 'in', 'night', 'sky',
      'guides', 'sailors', 'helps', 'with', 'directions',
    ],
    answer: 'star',
  },
  {
    id: 3,
    clueWords: [
      'device', 'people', 'hold', 'rings', 'connects',
      'voices', 'across', 'long', 'great', 'distances',
    ],
    answer: 'phone',
  },
]

function normalize(str: string) {
  return str.trim().toLowerCase()
}

function getPuzzleIndex(roundSeed: number) {
  if (!PUZZLES.length) return 0
  return Math.abs(roundSeed) % PUZZLES.length
}

export default function WordRevealBattle() {
  const [roundSeed, setRoundSeed] = useState(0)

  const puzzle = useMemo<Puzzle>(() => {
    if (!PUZZLES.length) {
      return {
        id: 0,
        clueWords: Array(10).fill('missing'),
        answer: 'test',
      }
    }
    const idx = getPuzzleIndex(roundSeed)
    return PUZZLES[idx]
  }, [roundSeed])

  // For each word: which team revealed it (null = hidden)
  const [revealedBy, setRevealedBy] = useState<(Team | null)[]>(
    () => Array(10).fill(null)
  )

  const [startingTeam, setStartingTeam] = useState<Team>('A')
  const [activeTeam, setActiveTeam] = useState<Team>('A')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [winner, setWinner] = useState<Team | null>(null)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState(
    'Team A starts. Choose any word to reveal, then guess.'
  )
  const [lastGuess, setLastGuess] = useState<string | null>(null)
  const [hasRevealedThisTurn, setHasRevealedThisTurn] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [score, setScore] = useState<Score>({ A: 0, B: 0 })

  // Highlight fully tied to current team
  const outerBg =
    activeTeam === 'A' ? 'bg-blue-50' : 'bg-red-50'
  const cardRing =
    activeTeam === 'A' ? 'ring-blue-300' : 'ring-red-300'
  const teamColor =
    activeTeam === 'A' ? 'text-blue-700' : 'text-red-600'
  const buttonBg =
    activeTeam === 'A'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-red-500 hover:bg-red-600'

  function nextTeam(team: Team): Team {
    return team === 'A' ? 'B' : 'A'
  }

  function allRevealed(flags: (Team | null)[]): boolean {
    return flags.every(Boolean)
  }

  // New round: alternate which team starts
  function resetRound() {
    setRoundSeed((s) => s + 1)
    setRevealedBy(Array(10).fill(null))
    setStatus('playing')
    setWinner(null)
    setGuess('')
    setLastGuess(null)
    setHasRevealedThisTurn(false)
    setShowInfo(false)

    setStartingTeam((prev) => {
      const next = nextTeam(prev)
      setActiveTeam(next)
      setMessage(
        `New round. Team ${next} starts. Choose any word to reveal, then guess.`
      )
      return next
    })
  }

  function handleReveal(index: number) {
    if (status !== 'playing') return
    if (hasRevealedThisTurn) {
      setMessage('You already revealed this turn. Now you must guess.')
      return
    }
    if (revealedBy[index]) {
      setMessage('That word is already revealed. Pick another one.')
      return
    }

    const next = [...revealedBy]
    next[index] = activeTeam
    setRevealedBy(next)
    setHasRevealedThisTurn(true)
    setMessage(`Word ${index + 1} revealed. Team ${activeTeam}, enter your guess.`)
  }

  function handleGuessSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status !== 'playing') return

    const value = normalize(guess)
    if (!value) {
      setMessage('Type a guess first.')
      return
    }

    const allShown = allRevealed(revealedBy)

    if (!hasRevealedThisTurn && !allShown) {
      setMessage('Reveal one word first, then guess.')
      return
    }

    // Track last guess always (uppercased for clarity)
    setLastGuess(`Team ${activeTeam} guessed: "${value.toUpperCase()}"`)

    if (value === normalize(puzzle.answer)) {
      setStatus('won')
      setWinner(activeTeam)
      setScore((prev) => ({
        ...prev,
        [activeTeam]: prev[activeTeam] + 1,
      }))
      setMessage(
        `Team ${activeTeam} is correct! The answer is ${puzzle.answer.toUpperCase()}.`
      )
      setGuess('')
      return
    }

    const other = nextTeam(activeTeam)
    setGuess('')
    setHasRevealedThisTurn(false)

    if (allShown) {
      setMessage(`Incorrect. All words are visible. Team ${other}, your turn to guess.`)
    } else {
      setMessage(
        `Incorrect. Team ${other}, choose any unrevealed word, then guess.`
      )
    }

    setActiveTeam(other)
  }

  const canPickWord = (i: number) =>
    status === 'playing' && !revealedBy[i] && !hasRevealedThisTurn

  return (
    <div
      className={`transition-colors duration-300 rounded-3xl p-6 mt-5 ${outerBg} max-w-5xl w-full mx-auto`}
    >
      <div className={`bg-white rounded-2xl p-8 md:p-10 ring-2 ${cardRing}`}>
        <div className="relative space-y-8">
          {/* Scoreboard - top right, larger bubbles */}
          <div className="absolute right-0 top-0 flex gap-3 text-xs sm:text-sm font-semibold">
            <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Team A: {score.A}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              Team B: {score.B}
            </div>
          </div>

          {/* Team bubbles centered */}
          <div className="flex justify-center gap-4 text-xs sm:text-sm pt-1">
            <div
              className={
                'px-4 py-1.5 rounded-full border font-medium ' +
                (activeTeam === 'A'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-700 border-blue-300')
              }
            >
              Team A
            </div>
            <div
              className={
                'px-4 py-1.5 rounded-full border font-medium ' +
                (activeTeam === 'B'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-red-600 border-red-300')
              }
            >
              Team B
            </div>
          </div>

          {/* Info toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowInfo((v) => !v)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-300 text-[11px] text-neutral-700 hover:bg-neutral-50 transition"
            >
              ⓘ {showInfo ? 'Hide instructions' : 'How to play'}
            </button>
          </div>

          {/* Instructions (collapsible) */}
          {showInfo && (
            <div className="text-xs text-neutral-700 space-y-1 text-center">
              <p>Two teams share one hidden 10-word question.</p>
              <p>
                On your team&apos;s turn, click any unrevealed word to reveal it, then make one guess.
              </p>
              <p>
                Guess correctly to win. Guess wrong and the turn (and next reveal) goes to the other team.
              </p>
              <p>Each new round, the starting team alternates automatically.</p>
            </div>
          )}

          {/* Clue words */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4 mt-2">
            {puzzle.clueWords.map((word, i) => {
              const revealer = revealedBy[i]
              const isRevealed = !!revealer
              const clickable = canPickWord(i)

              const revealedClasses =
                revealer === 'A'
                  ? 'bg-blue-50 border-blue-300 text-blue-900'
                  : 'bg-red-50 border-red-300 text-red-900'

              const hiddenClasses =
                'bg-neutral-50/90 border-dashed border-neutral-300 text-transparent shadow-inner ' +
                (clickable
                  ? 'hover:bg-neutral-100 cursor-pointer'
                  : 'cursor-default opacity-80')

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && handleReveal(i)}
                  className={
                    'h-12 md:h-14 rounded-xl border text-sm font-medium flex items-center justify-center transition ' +
                    (isRevealed ? revealedClasses : hiddenClasses)
                  }
                >
                  {isRevealed ? word : ''}
                </button>
              )
            })}
          </div>

          {/* Controls */}
          {status === 'playing' && (
            <div className="space-y-3 mt-2">
              <div className={`text-sm font-medium ${teamColor}`}>
                {activeTeam === 'A' ? "Team A's turn" : "Team B's turn"}
              </div>

              <form
                onSubmit={handleGuessSubmit}
                className="flex flex-wrap gap-2 items-center"
              >
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter your answer"
                  className="flex-1 min-w-[220px] rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className={`rounded-xl px-4 py-3 text-white text-sm font-medium transition ${buttonBg}`}
                >
                  Guess
                </button>
              </form>
            </div>
          )}

          {/* Message + last guess */}
          <div className="space-y-1">
            <div className="text-sm text-neutral-700">
              {message}
            </div>
            {lastGuess && (
              <div className="text-xs text-neutral-500">
                {lastGuess}
              </div>
            )}
          </div>

          {/* Result + new round */}
          {status === 'won' && winner && (
            <div className="flex flex-wrap gap-3 items-center text-sm">
              <span className="font-semibold text-green-700">
                Team {winner} wins this round!
              </span>
              <button
                type="button"
                onClick={resetRound}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 transition"
              >
                New round
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
