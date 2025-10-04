import { Link } from 'react-router-dom'

export default function EmptyState() {
  return (
    <div className="rounded-2xl shadow-sm border border-neutral-200 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold mb-2">No game here yet</h3>
      <p className="text-neutral-600 mb-4">We’re still building this one. Check back soon!</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  )
}
