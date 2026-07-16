import { Link, useLocation } from 'react-router-dom';
import authStore from '../store/authStore';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Homework', to: '/homework' },
  { label: 'Content', to: '/content' },
  { label: 'Planner', to: '/planner' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
];

function AppShell({ children }) {
  const location = useLocation();
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const logout = authStore((state) => state.logout);

  return (
    <div className="app-frame">
      <header className="topbar">
        <Link className="brand" to="/">
          EduGlobe AI
        </Link>

        <nav className="topnav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          {isAuthenticated ? (
            <button className="secondary-btn" type="button" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="secondary-btn" to="/login">
                Login
              </Link>
              <Link className="primary-btn" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="content-wrap">{children}</div>
    </div>
  );
}

export default AppShell;
