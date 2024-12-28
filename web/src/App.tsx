import Terminal from './features/terminal/Terminal'

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="py-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Terminal Fusion</h1>
        <p className="text-slate-400">Web Terminal Interface</p>
      </header>
      <main className="container mx-auto px-4">
        <Terminal />
      </main>
      <footer className="fixed bottom-0 w-full py-4 text-center text-slate-500">
        <p>Connected to localhost:8000</p>
      </footer>
    </div>
  )
}

export default App
