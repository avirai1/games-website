import type { Game } from '../components/GameCard'

export const games: Game[] = [
  {
    slug: 'wordlink',
    title: 'WordLink',
    type: 'daily',
    description: 'A crisp, once-a-day word puzzle. Share streaks with friends.',
    status: 'coming_soon',
    players: '1 player',
    estTime: '2–5 min'
  },
  {
    slug: 'cipher-sprint',
    title: 'Cipher Sprint',
    type: 'solo',
    description: 'Crack the code under a timer. Great for warm-ups.',
    status: 'coming_soon',
    players: '1 player',
    estTime: '3–8 min'
  },
  {
    slug: 'guess-who',
    title: 'Guess Who?',
    type: 'party',
    description: 'A fast party round where the table guesses the secret prompt.',
    status: 'coming_soon',
    players: '3–10 players',
    estTime: '5–15 min'
  }
]
