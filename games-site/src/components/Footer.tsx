export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Games Hub. All rights reserved.</p>
        <p className="opacity-80">Built with React + Tailwind.</p>
      </div>
    </footer>
  )
}
