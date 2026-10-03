import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useAdminAuth } from "../admin/AdminAuthContext";
import { useToastStore } from "../store/toastStore";

export default function Layout() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { admin } = useAdminAuth();
  const favoriteCount = useFavoritesStore((state) => state.getFavoriteCount());
  
  const toastMessage = useToastStore((state) => state.message);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("addis-eats-theme") === "dark");

  const closeMenu = () => setMenuOpen(false);
  const toggleTheme = () => setDarkMode((current) => {
    const next = !current;
    localStorage.setItem("addis-eats-theme", next ? "dark" : "light");
    return next;
  });

  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : "theme-light"}`}>
      <header className="site-header">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-dot">✦</span>
          <span>
            Addis <i>Eats</i>
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile/tablet */}
        <div className="nav-panel desktop-nav">
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/" end>Our story</NavLink>
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/favorites">
              Favorites {favoriteCount > 0 && <span className="nav-count">{favoriteCount}</span>}
            </NavLink>
            {admin && <NavLink to="/admin">Dashboard</NavLink>}
          </nav>
        </div>

        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`} aria-pressed={darkMode}>
            <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
            <span>{darkMode ? "Light" : "Dark"}</span>
          </button>
          
          {user ? (
            <button className="text-button" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <Link className="text-button" to="/login" onClick={closeMenu}>
              Sign in
            </Link>
          )}

          <Link
            className="cart-link"
            to="/cart"
            aria-label={`Cart with ${itemCount} items`}
            onClick={closeMenu}
          >
            Bag <span>{itemCount}</span>
          </Link>
        </div>

        {/* Hamburger — visible on mobile/tablet only */}
        <button
          type="button"
          className={`hamburger ${menuOpen ? "is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div className={`mobile-menu-overlay ${menuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu-bg" onClick={closeMenu} />
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <Link className="brand" to="/" onClick={closeMenu}>
              <span className="brand-dot">✦</span>
              <span>Addis <i>Eats</i></span>
            </Link>
            <button
              type="button"
              className="mobile-menu-close"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              ✕
            </button>
          </div>

          <nav className="mobile-menu-links" aria-label="Mobile navigation">
            <NavLink to="/" end onClick={closeMenu}>
              <span className="mobile-link-number">01</span>
              <span className="mobile-link-text">Our Story</span>
            </NavLink>
            <NavLink to="/menu" onClick={closeMenu}>
              <span className="mobile-link-number">02</span>
              <span className="mobile-link-text">Menu</span>
            </NavLink>
            <NavLink to="/favorites" onClick={closeMenu}>
              <span className="mobile-link-number">03</span>
              <span className="mobile-link-text">Favorites</span>
              {favoriteCount > 0 && <span className="mobile-link-badge">{favoriteCount}</span>}
            </NavLink>
            <NavLink to="/cart" onClick={closeMenu}>
              <span className="mobile-link-number">04</span>
              <span className="mobile-link-text">Cart</span>
              {itemCount > 0 && <span className="mobile-link-badge">{itemCount}</span>}
            </NavLink>
            {admin && (
              <NavLink to="/admin" onClick={closeMenu}>
                <span className="mobile-link-number">05</span>
                <span className="mobile-link-text">Dashboard</span>
              </NavLink>
            )}
          </nav>

          <div className="mobile-menu-footer">
            <div className="mobile-menu-actions">
              <button className="mobile-menu-action-btn" type="button" onClick={() => { toggleTheme(); }}>
                <span>{darkMode ? "☀" : "☾"}</span>
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
              {user ? (
                <button className="mobile-menu-action-btn" onClick={() => { signOut(); closeMenu(); }}>
                  Sign out
                </button>
              ) : (
                <Link className="mobile-menu-action-btn" to="/login" onClick={closeMenu}>
                  Sign in →
                </Link>
              )}
            </div>
            <p className="mobile-menu-tagline">Thoughtful Ethiopian dishes,<br />delivered across Addis.</p>
          </div>
        </div>
      </div>

      <Outlet />

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-about">
            <Link className="brand" to="/">
              <span className="brand-dot">✦</span>
              <span>
                Addis <i>Eats</i>
              </span>
            </Link>
            <p>
              Thoughtful Ethiopian dishes, made with local ingredients and
              delivered across Addis with care. Food with a story.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/menu">Full Menu</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
              <li><Link to="/orders">Order History</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">Our Story</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Addis Eats. All rights reserved.</span>
          <div className="footer-bottom-links">
            <Link to="/">Privacy</Link>
            <Link to="/">Terms</Link>
          </div>
        </div>
      </footer>
      
      {/* Global Toast Notification */}
      <div className={`global-toast ${toastMessage ? "is-visible" : ""}`}>
        <span className="toast-icon">✓</span>
        <span className="toast-message">{toastMessage}</span>
      </div>
    </div>
  );
}
