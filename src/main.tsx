import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Bingo from './pages/Bingo.tsx'
import BingoAdmin from "./pages/BingoAdmin.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/bingo" element={<Bingo />} />
                <Route path="/bingo-admin" element={<BingoAdmin />} />
            </Routes>
      </BrowserRouter>
  </StrictMode>,
)
