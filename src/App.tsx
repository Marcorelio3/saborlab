import { HashRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Catalog } from './pages/Catalog'
import { Editor } from './pages/Editor'
import { Login } from './pages/Login'
import { Terms } from './pages/Terms'
import { useSession } from './hooks/useSession'

export default function App() {
  const { session } = useSession()

  return (
    <HashRouter>
      <Header session={session} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Catalog session={session} />} />
          <Route path="/editor" element={<Editor session={session} />} />
          <Route path="/login" element={<Login session={session} />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="*" element={<Catalog session={session} />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  )
}
