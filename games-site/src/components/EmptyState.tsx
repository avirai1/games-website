import { Link } from 'react-router-dom'

export default function EmptyState() {
  return (
    <div className="card p-10 text-center">
      <h3 className="text-lg font-semibold mb-2">No game here yet</h3>
      <p className="text-neutral-600 mb-4">We’re still building this one. Check back soon!</p>
      <Link to="/" className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 transition">Go Home</Link>
    </div>
  )
}
