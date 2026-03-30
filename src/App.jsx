import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DogProvider } from './context/DogContext'
import Navbar from './components/Navbar'
import WelcomePage from './pages/WelcomePage'
import RegisterPage from './pages/RegisterPage'
import DogListPage from './pages/DogListPage'
import EditDogPage from './pages/EditDogPage'

export default function App() {
  return (
    <DogProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dogs" element={<DogListPage />} />
          <Route path="/dogs/:id/edit" element={<EditDogPage />} />
        </Routes>
      </BrowserRouter>
    </DogProvider>
  )
}
