import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Dumbbell,
  Home,
  Plus,
  UserRound,
} from 'lucide-react'

const navigation = [
  {
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    label: 'Workouts',
    path: '/workouts',
    icon: Dumbbell,
  },
  {
    label: 'Progress',
    path: '/progress',
    icon: BarChart3,
  },
]

function AppShell() {
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">S</span>
          <span>SanchFit</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink to="/profile" className="sidebar-profile">
          <span className="avatar">S</span>

          <span className="sidebar-profile-info">
            <strong>Your profile</strong>
            <small>Settings & data</small>
          </span>

          <UserRound size={18} strokeWidth={1.8} />
        </NavLink>
      </aside>

      <div className="app-content">
        <header className="mobile-header">
          <div className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-name">SanchFit</span>
          </div>

          <NavLink
            to="/profile"
            className="mobile-avatar"
            aria-label="Open profile"
          >
            S
          </NavLink>
        </header>

        <main className="page-content">
          <Outlet />
        </main>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Home size={21} strokeWidth={1.8} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Dumbbell size={21} strokeWidth={1.8} />
            <span>Workouts</span>
          </NavLink>

          <button className="quick-add-button" aria-label="Quick add">
            <Plus size={25} strokeWidth={2} />
          </button>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <BarChart3 size={21} strokeWidth={1.8} />
            <span>Progress</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <UserRound size={21} strokeWidth={1.8} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default AppShell