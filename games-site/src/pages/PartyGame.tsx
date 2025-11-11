import { useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import WordRevealBattle from '../games/party/WordRevealBattle'

const registry: Record<string, { name: string; component: React.ComponentType }> = {
  'word-reveal-battle': {
    name: 'Question Reveal Battle',
    component: WordRevealBattle,
  },
}

export default function PartyGame() {
  const { slug } = useParams()
  const entry = slug ? registry[slug] : undefined
  const View = entry?.component
  const title = entry?.name ?? 'Party Game'

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
      {/* 👇 This is the title */}
      <h1 className="text-2xl font-semibold text-center mb-6">
        {title}
      </h1>

      <div className="flex justify-center">
        {View ? <View /> : <EmptyState />}
      </div>
    </div>
  )
}
