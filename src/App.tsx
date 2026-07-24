import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DynamicPageFactory from './components/DynamicPageFactory'

function App() {

  return (
    <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/:citySlug/:serviceSlug"
            element={<DynamicPageFactory />}
          />

        </Routes>
      </BrowserRouter>
  )
}

export default App
