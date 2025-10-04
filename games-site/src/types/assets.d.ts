// Enable importing raw text files via Vite, e.g. `import list from './allowed.txt?raw'`
declare module '*.txt?raw' {
  const content: string
  export default content
}
