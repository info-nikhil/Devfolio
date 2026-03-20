import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/plans", label: "Plans" },
  { to: "/contact", label: "Contact" }
];

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="top-nav">
      <div className="content-wrap nav-inner">
        <Link to="/" className="brand brand-lockup">
          <span className="brand-mark">PB</span>
          <span className="brand-copy">
            <strong>Portfolio Builder</strong>
            <small>Creator Suite</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Dashboard
              </NavLink>
              <NavLink to="/builder" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Builder
              </NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="nav-user">
                <span className="user-chip">{user?.role || "user"}</span>
                <div>
                  <strong>{user?.name}</strong>
                  <small>{user?.email}</small>
                </div>
              </div>
              <button type="button" className="btn btn-ghost btn-small" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/plans" className="btn btn-ghost btn-small">
                Pricing
              </Link>
              <Link to="/auth" className="btn btn-primary btn-small">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
