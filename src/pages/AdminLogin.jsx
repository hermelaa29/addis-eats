import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../admin/AdminAuthContext";

export default function AdminLogin() {
  const { admin, signIn } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const returnTo =
    new URLSearchParams(location.search).get("returnTo") || "/admin";

  if (admin)
    return (
      <main className="page narrow">
        <div className="state state-empty">
          <span className="state-mark">✓</span>
          <h1>Admin access is active.</h1>
          <p>Continue to the Addis Eats control room.</p>
          <Link className="button button-dark" to="/admin">
            Open dashboard
          </Link>
        </div>
      </main>
    );

  const submit = (event) => {
    event.preventDefault();
    if (!signIn(form.email.trim(), form.password)) {
      setError("Incorrect admin username or password.");
      return;
    }
    navigate(returnTo, { replace: true });
  };

  return (
    <main className="page auth-page">
      <div className="auth-card admin-auth-card">
        <p className="eyebrow">Addis Eats control room</p>
        <h1>Admin sign in.</h1>
        <p>Manage the restaurant experience from one quiet place.</p>
        <form onSubmit={submit} noValidate>
          <label>
            Admin email
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              autoComplete="username"
              placeholder="admin@gmail.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>
          {error && (
            <small className="field-error" role="alert">
              {error}
            </small>
          )}
          <button className="button button-dark full" type="submit">
            Enter dashboard <span>→</span>
          </button>
        </form>
        <Link className="back-link" to="/">
          ← Return to storefront
        </Link>
      </div>
    </main>
  );
}
