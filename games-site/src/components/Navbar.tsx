import { Link, NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4 justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-brand-600 text-white grid place-items-center font-bold">G</div>
          <span className="font-semibold text-neutral-900">Games Hub</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-brand-700' : 'text-neutral-600 hover:text-neutral-900'}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-brand-700' : 'text-neutral-600 hover:text-neutral-900'}>About</NavLink>
          <a href="https://github.com/avirai1/games-website" target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-neutral-900">GitHub</a>
        </nav>
      </div>
    </header>
  )
}
