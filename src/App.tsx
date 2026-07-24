import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './apps/instituto-logos/pages/HomePage'
import { NotFoundPage } from './apps/instituto-logos/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
