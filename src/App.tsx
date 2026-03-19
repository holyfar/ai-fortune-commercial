import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BaziPage from './pages/BaziPage'
import XingzuoPage from './pages/XingzuoPage'
import TaluoPage from './pages/TaluoPage'
import ChatPage from './pages/ChatPage'
import VipPage from './pages/VipPage'
import AdminPage from './pages/AdminPage'
import useAppStore from './lib/store'

function App() {
  const initUserFromCloud = useAppStore((state) => state.initUserFromCloud)

  useEffect(() => {
    initUserFromCloud()
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bazi" element={<BaziPage />} />
        <Route path="/xingzuo" element={<XingzuoPage />} />
        <Route path="/taluo" element={<TaluoPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/vip" element={<VipPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
