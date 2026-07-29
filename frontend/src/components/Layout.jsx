import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useStore from '../store';

export default function Layout() {
  const { sidebarOpen } = useStore();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#081C2D' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? 240 : 72,
        marginTop: 64,
        transition: 'margin-left 0.3s ease',
        padding: '1.5rem',
        minHeight: 'calc(100vh - 64px)',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
