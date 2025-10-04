import { useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Wordle from '../games/daily/Wordle'
import WordLink from '../games/daily/WordLink'

const registry: Record<string, React.ComponentType> = {
  wordle: Wordle,
  wordlink: WordLink,
}

export default function DailyGame() {
  const { slug } = useParams()
  const View = slug ? registry[slug] : undefined

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Daily: {slug}</h1>
      {View ? <View /> : <EmptyState />}
    </div>
  )
}
