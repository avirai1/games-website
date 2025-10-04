import { games } from '../data/games.ts'
import { GameCard } from '../components/GameCard'

export default function Home() {
  const daily = games.filter(g => g.type === 'daily')
  const party = games.filter(g => g.type === 'party')
  const solo = games.filter(g => g.type === 'solo')

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
          All your games, one hub
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Start with a clean UI now. Add games incrementally without touching layout, routing, or styles.
        </p>
      </section>

      <Section title="Daily Puzzles" items={daily} />
      <Section title="Party Games" items={party} />
      <Section title="Solo Games" items={solo} />
    </div>
  )
}

function Section({ title, items }: { title: string, items: any[] }) {
  if (items.length === 0) return null
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((g) => (<GameCard key={g.slug} game={g} />))}
      </div>
    </section>
  )
}
