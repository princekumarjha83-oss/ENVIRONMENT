import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Copilot from './pages/Copilot';
import ImageAnalysis from './pages/ImageAnalysis';
import Predictions from './pages/Predictions';
import HealthScore from './pages/HealthScore';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import CityRanking from './pages/CityRanking';
import Sustainability from './pages/Sustainability';
import Carbon from './pages/Carbon';
import Datasets from './pages/Datasets';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import News from './pages/News';
import SettingsPage from './pages/SettingsPage';
import About from './pages/About';
import Login from './pages/Login';

const PAGE_TITLES = {
  '/dashboard': '📊 Smart Dashboard',
  '/map': '🗺️ Pollution Map',
  '/copilot': '🤖 AI Copilot',
  '/image-analysis': '📸 Image Analysis',
  '/predictions': '📈 AI Predictions',
  '/health-score': '🌱 Health Score',
  '/analytics': '📊 Analytics',
  '/reports': '📄 Reports',
  '/alerts': '🚨 Alert Centre',
  '/city-ranking': '🏆 City Ranking',
  '/sustainability': '🌳 Sustainability',
  '/carbon': '🧮 Carbon Calculator',
  '/datasets': '📂 Datasets',
  '/profile': '👤 Profile',
  '/admin': '👨‍💼 Admin Panel',
  '/news': '📰 Eco News',
  '/settings': '⚙️ Settings',
  '/about': '🏅 About',
};

function NavbarWrapper() {
  const location = useLocation();
  return <Navbar title={PAGE_TITLES[location.pathname] || 'EcoWatch AI'} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route element={<><NavbarWrapper /><Layout /></>}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/map' element={<MapPage />} />
        <Route path='/copilot' element={<Copilot />} />
        <Route path='/image-analysis' element={<ImageAnalysis />} />
        <Route path='/predictions' element={<Predictions />} />
        <Route path='/health-score' element={<HealthScore />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/alerts' element={<Alerts />} />
        <Route path='/city-ranking' element={<CityRanking />} />
        <Route path='/sustainability' element={<Sustainability />} />
        <Route path='/carbon' element={<Carbon />} />
        <Route path='/datasets' element={<Datasets />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/news' element={<News />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/about' element={<About />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-right' toastOptions={{
        style: { background: '#0D2137', color: '#E2F0FF', border: '1px solid rgba(14,165,233,0.3)', fontFamily: 'Poppins' }
      }} />
      <AppRoutes />
    </BrowserRouter>
  );
}
