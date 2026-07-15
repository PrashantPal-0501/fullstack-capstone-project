import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/app');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <Link className="navbar-brand fw-semibold" to="/app">
        GiftLink
      </Link>
      <div className="d-flex ms-auto align-items-center gap-3">
        <Link className="nav-link d-inline" to="/app">
          Home
        </Link>
        <Link className="nav-link d-inline" to="/app/gifts">
          Gifts
        </Link>
        <Link className="nav-link d-inline" to="/app/search">
          Search
        </Link>

        {isLoggedIn ? (
          <>
            <span className="text-muted">Welcome, {user?.firstName}</span>
            <button className="btn btn-success" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-success" to="/app/login">
              Login
            </Link>
            <Link className="nav-link d-inline" to="/app/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
