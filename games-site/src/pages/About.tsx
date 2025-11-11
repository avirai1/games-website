export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">About Games Hub</h1>
      <div className="space-y-4 text-neutral-700">
        <p>
          This is a hub for different types of daily, party, and strategy games. Games are continously being added.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Daily puzzles get their own route under <code>/daily/:slug</code>.</li>
          <li>Party games get <code>/party/:slug</code>.</li>
          <li>Reusable components keep everything consistent.</li>
        </ul>
      </div>
    </div>
  )
}
