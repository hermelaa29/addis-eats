import { NavLink, Outlet, Link } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export default function AdminLayout() {
  const { signOut } = useAdminAuth();
  return (
    <main className="page admin-page">
      <div className="admin-heading"><div><p className="eyebrow">Addis Eats / private area</p><h1>Control room</h1></div><button className="button button-light" type="button" onClick={signOut}>Sign out</button></div>
      <nav className="category-bar" aria-label="Admin navigation"><NavLink className="category" to="/admin" end>Dashboard</NavLink><NavLink className="category" to="/admin/menu">Menu</NavLink><NavLink className="category" to="/admin/orders">Orders</NavLink><Link className="category" to="/menu">Storefront</Link></nav>
      <Outlet />
    </main>
  );
}
