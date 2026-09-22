import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.tsx';
import CollectionProvider from './context/CollectionProvider.tsx';
import ProtectedRoute from './components/routing/ProtectedRoute.tsx';
import NotFound from './pages/NotFound.tsx';
import HomePage from './pages/HomePage.tsx';
import CataloguePage from './pages/CataloguePage.tsx';
import ItemDetailPage from './pages/ItemDetailPage.tsx';
import CollectionPage from './pages/CollectionPage.tsx';
import StatsPage from './pages/StatsPage.tsx';
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'

function App() {
  return (
  <BrowserRouter>
    <AuthProvider>
      <CollectionProvider>
        <Routes>
          <Route path="/" element={<HomePage/> } />
          <Route path="/catalogue" element={<CataloguePage/> } />
          <Route path="/items/:id" element={<ItemDetailPage/> } />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/collection" element={<CollectionPage/>} />
            <Route path="/stats" element={<StatsPage/>} />
          </Route>

          <Route path="*" element={<NotFound/> } />
        </Routes>
      </CollectionProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App
