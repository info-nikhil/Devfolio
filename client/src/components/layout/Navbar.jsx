import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="top-nav">
      <div className="content-wrap nav-inner">
        <Link to="/" className="brand">
          <span>PortfolioBuilder</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/plans">Plans</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
          {isAuthenticated && <NavLink to="/builder">Builder</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-chip">{user.name}</span>
              <button type="button" className="btn btn-small" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-small">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
