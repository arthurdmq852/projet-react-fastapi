import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'

function App() {
  return ( 
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/> } />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="*" element={<NotFound/> } />
    </Routes>
  </BrowserRouter>
  );
}

export default App
