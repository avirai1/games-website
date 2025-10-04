import { Link } from 'react-router-dom'
import { Pill } from './Pill'

export type Game = {
  slug: string
  title: string
  type: 'daily' | 'party' | 'solo'
  description: string
  status: 'available' | 'coming_soon'
  players?: string
  estTime?: string
}

export function GameCard({ game }: { game: Game }) {
  const to =
    game.type === 'daily'
      ? `/daily/${game.slug}`
      : game.type === 'party'
      ? `/party/${game.slug}`
      : `/${game.type}/${game.slug}`

  return (
    <article className="rounded-2xl shadow-sm border border-neutral-200 bg-white p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Pill>{game.type.toUpperCase()}</Pill>
        {game.status === 'coming_soon' && <Pill>Coming Soon</Pill>}
        {game.players && <Pill>{game.players}</Pill>}
        {game.estTime && <Pill>{game.estTime}</Pill>}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900">{game.title}</h3>
      <p className="text-neutral-600 flex-1">{game.description}</p>
      <div>
        {game.status === 'available' ? (
          <Link
            to={to}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Play
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-neutral-200 text-neutral-600 cursor-not-allowed"
          >
            In Development
          </button>
        )}
      </div>
    </article>
  )
}
