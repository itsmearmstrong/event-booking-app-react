import { useState, type FormEvent } from "react";
import { Lock, LogIn, Mail, Ticket } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={state?.from?.pathname ?? "/events"} replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    login(email.trim());
    navigate(state?.from?.pathname ?? "/events", { replace: true });
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Featured event">
        <div>
          <Ticket size={42} aria-hidden="true" />
          <p>Live shows, local stages, saved seats.</p>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-card">
          <div className="section-kicker">EventFlow</div>
          <h1 id="login-title">Sign in</h1>
          <p className="muted">Use any valid email and password to start booking.</p>

          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            <label>
              <span>Email</span>
              <div className="input-with-icon">
                <Mail size={18} aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="input-with-icon">
                <Lock size={18} aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button className="primary-button full-width" type="submit">
              <LogIn size={18} aria-hidden="true" />
              Sign in
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
