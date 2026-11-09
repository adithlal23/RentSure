import { useState } from "react";
import {
  ShieldCheck, Eye, EyeOff, ArrowRight,
  UserRound, Building2, Mail, LockKeyhole
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Auth.css";

export default function Register() {
  const [role, setRole] = useState("tenant");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Register user in MySQL through Express API
      await registerUser({
        full_name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: role
      });

      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-story">
        <Link to="/" className="auth-brand">
          <span className="brand-icon"><ShieldCheck size={23} /></span>
          <span>rent<span className="brand-accent">sure</span></span>
        </Link>

        <div className="story-content">
          <span className="auth-eyebrow">A BETTER WAY TO RENT</span>
          <h1>Build a rental experience around <span>trust.</span></h1>
          <p>
            Join a platform designed to make property records,
            inspections and rental settlements more transparent.
          </p>

          <div className="story-points">
            <div><ShieldCheck /> Documented property conditions</div>
            <div><Building2 /> Organized rental management</div>
            <div><LockKeyhole /> Transparent records for both sides</div>
          </div>
        </div>

        <div className="story-bottom">
          © 2026 RentSure. Rental transparency. Documented trust.
        </div>
      </section>

      <section className="auth-form-side">
        <Link to="/" className="auth-back">
          <span>←</span> Back to home
        </Link>

        <div className="auth-form-wrap register-form-wrap">
          <div className="auth-mobile-brand">
            <ShieldCheck size={26} /> RentSure
          </div>

          <span className="auth-eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="auth-subtitle">
            Tell us a little about yourself to get started.
          </p>

          <form onSubmit={handleSubmit}>
            <label>I want to join as a</label>

            <div className="role-selector">
              <button
                type="button"
                className={role === "tenant" ? "role-option selected" : "role-option"}
                onClick={() => setRole("tenant")}
              >
                <UserRound size={20} />
                <span>Tenant</span>
                <small>I'm renting a property</small>
              </button>

              <button
                type="button"
                className={role === "landlord" ? "role-option selected" : "role-option"}
                onClick={() => setRole("landlord")}
              >
                <Building2 size={20} />
                <span>Landlord</span>
                <small>I own a property</small>
              </button>
            </div>

            <label htmlFor="reg-name">Full name</label>
            <div className="auth-input-wrap">
              <UserRound size={18} />
              <input
                id="reg-name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={updateField}
                autoComplete="name"
              />
            </div>

            <label htmlFor="reg-email">Email address</label>
            <div className="auth-input-wrap">
              <Mail size={18} />
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
              />
            </div>

            <label htmlFor="reg-password">Password</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={updateField}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label htmlFor="reg-confirm">Confirm password</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={updateField}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="auth-message error">{error}</div>}
            {message && <div className="auth-message success">{message}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </div>

          <p className="auth-legal">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}