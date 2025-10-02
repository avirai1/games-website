import { useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function DailyGame() {
  const { slug } = useParams()

  // Placeholder: swap with the actual Daily game component later.
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Daily: {slug}</h1>
      <EmptyState />
    </div>
  )
}
