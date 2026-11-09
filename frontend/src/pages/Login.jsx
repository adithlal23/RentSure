import { useState } from "react";
import {
  ShieldCheck, Eye, EyeOff, ArrowRight,
  Mail, LockKeyhole, ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Auth.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("tenant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Connect to the actual backend
      const response = await loginUser({
        email: email.trim(),
        password
      });

      const user = response.user;

      if (!user) {
        throw new Error("Invalid login response from server.");
      }

      // Check selected role against database role
      if (user.role !== role) {
        localStorage.removeItem("rentsure_token");
        localStorage.removeItem("rentsure_user");

        setError(`This account is registered as ${user.role}. Please select the correct role.`);
        return;
      }

      // Redirect based on actual database role
      if (user.role === "tenant") {
        navigate("/tenant/dashboard");
      } else if (user.role === "landlord") {
        navigate("/landlord/dashboard");
      } else {
        setError("Your account does not have dashboard access.");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link to="/" className="auth-brand">
          <span className="brand-icon">
            <ShieldCheck size={23} />
          </span>
          <span>rent<span className="brand-accent">sure</span></span>
        </Link>

        <div className="story-content">
          <span className="auth-eyebrow">WELCOME BACK</span>
          <h1>Your rental journey deserves <span>clarity.</span></h1>
          <p>
            Access your property records, inspections, maintenance
            updates and deposit information in one place.
          </p>

          <div className="story-points">
            <div><ShieldCheck /> Transparent rental records</div>
            <div><LockKeyhole /> Secure account access</div>
            <div><Mail /> Everything organized in one place</div>
          </div>
        </div>

        <div className="story-bottom">
          © 2026 RentSure. Rental transparency. Documented trust.
        </div>
      </section>

      <section className="auth-form-side">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <ShieldCheck size={26} /> RentSure
          </div>

          <span className="auth-eyebrow">YOUR ACCOUNT</span>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Login as</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="auth-role-select"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>

            <label htmlFor="login-email">Email address</label>
            <div className="auth-input-wrap">
              <Mail size={18} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="auth-message error">{error}</div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register"> Create account</Link>
          </div>

          <p className="auth-legal">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}