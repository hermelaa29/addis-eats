import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import gsap from "gsap";

export default function Login() {
  const user = useAuthStore((state) => state.user);
  const signIn = useAuthStore((state) => state.signIn);
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = new URLSearchParams(location.search).get("returnTo") || "/";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState(false);
  
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".auth-card > *", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  if (user)
    return (
      <main className="page narrow" ref={pageRef}>
        <div className="state state-empty auth-card">
          <h1>You are already signed in</h1>
          <p>Welcome back, {user.name}.</p>
          <Link
            className="button button-dark"
            to={user.isAdmin ? "/admin" : returnTo}
          >
            Continue
          </Link>
        </div>
      </main>
    );

  const submit = (event) => {
    event.preventDefault();
    setTouched(true);

    if (
      !form.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.password.trim()
    ) {
      return;
    }

    const isAdmin = signIn(form.name.trim(), form.email, form.password);
    navigate(isAdmin ? "/admin" : returnTo, { replace: true });
  };

  return (
    <main className="page auth-page" ref={pageRef}>
      <div className="auth-card">
        <p className="eyebrow">Welcome to the table</p>
        <h1>Sign in to continue.</h1>
        <p>
          Use your name, email, and password. Admins can sign in here to open
          the dashboard.
        </p>
        <form onSubmit={submit} noValidate>
          <label>
            Full name
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              onBlur={() => setTouched(true)}
              placeholder="e.g. Hana Bekele"
            />
            {touched && !form.name.trim() && (
              <small className="field-error">Please enter your name.</small>
            )}
          </label>
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              onBlur={() => setTouched(true)}
              placeholder="you@example.com"
            />
            {touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
              <small className="field-error">
                Enter a valid email address.
              </small>
            )}
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              onBlur={() => setTouched(true)}
              placeholder="Enter your password"
            />
            {touched && !form.password.trim() && (
              <small className="field-error">Please enter your password.</small>
            )}
          </label>
          <button className="button button-dark full" type="submit">
            Sign in <span>→</span>
          </button>
        </form>
        <Link className="back-link" to="/">
          ← Return home
        </Link>
      </div>
    </main>
  );
}
