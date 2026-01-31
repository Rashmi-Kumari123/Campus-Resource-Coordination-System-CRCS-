import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canManageResources, canApproveBookings, isAdmin } from '../types';
import './Layout.css';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const canManage = user && canManageResources(user.role);
  const canApprove = user && canApproveBookings(user.role);
  const admin = user && isAdmin(user.role);

  const path = location.pathname;
  const isResourcesActive =
    path === '/resources' || (path.startsWith('/resources/') && !path.startsWith('/resources/manage'));
  const isManageResourcesActive = path.startsWith('/resources/manage');

  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/dashboard" className="layout-brand">
          <span className="layout-brand-icon">◉</span>
          CRCS
        </Link>
        <nav className="layout-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/resources" className={() => (isResourcesActive ? 'active' : '')}>
            Resources
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'active' : '')}>
            Bookings
          </NavLink>
          {canManage && (
            <NavLink to="/resources/manage" className={() => (isManageResourcesActive ? 'active' : '')}>
              Manage Resources
            </NavLink>
          )}
          {(canApprove || admin) && (
            <NavLink to="/bookings/pending" className={({ isActive }) => (isActive ? 'active' : '')}>
              Pending
            </NavLink>
          )}
          {admin && (
            <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              Users
            </NavLink>
          )}
        </nav>
        <div className="layout-user">
          <span className="layout-role">{user?.role}</span>
          <span className="layout-email">{user?.email}</span>
          <button type="button" className="layout-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
