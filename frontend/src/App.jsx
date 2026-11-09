
import {
  ShieldCheck,
  ArrowUpRight,
  Check,
  Camera,
  ClipboardCheck,
  Wallet,
  FileCheck2,
  Menu,
  X,
  Home,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  LockKeyhole,
  ChevronRight,
  BadgeCheck,
  MapPin
} from "lucide-react";
import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const features = [
  {
    icon: Camera,
    number: "01",
    title: "Document every detail",
    description:
      "Capture room conditions, existing damage and property evidence before moving in."
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Track every issue",
    description:
      "Keep maintenance requests, responses and resolutions organized in one place."
  },
  {
    icon: Wallet,
    number: "03",
    title: "Transparent deposits",
    description:
      "Maintain clear deposit records and itemized deductions with supporting evidence."
  },
  {
    icon: FileCheck2,
    number: "04",
    title: "Move-out with confidence",
    description:
      "Compare inspection records and create a transparent settlement report."
  }
];

const steps = [
  {
    number: "01",
    title: "Create your rental record",
    description:
      "Connect the tenant, landlord, property and rental agreement."
  },
  {
    number: "02",
    title: "Document the property",
    description:
      "Record room conditions with photographs and shared acknowledgements."
  },
  {
    number: "03",
    title: "Track the rental journey",
    description:
      "Manage maintenance, payments and important property updates."
  },
  {
    number: "04",
    title: "Settle with transparency",
    description:
      "Review move-out evidence and generate an itemized deposit statement."
  }
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#" className="brand" onClick={closeMenu}>
        <span className="brand-icon">
          <ShieldCheck size={23} />
        </span>
        <span>rent<span className="brand-accent">sure</span></span>
      </a>

      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        <a href="#features" onClick={closeMenu}>Features</a>
        <a href="#how-it-works" onClick={closeMenu}>How it works</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
        <Link to="/register" className="nav-cta">
  Get started <ArrowUpRight size={16} />
</Link>
      </nav>

      <div className="nav-actions">
        <Link to="/register" className="mobile-cta" onClick={closeMenu}>
  Get started <ArrowUpRight size={16} />
</Link>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function HeroPreview() {
  return (
    <div className="hero-visual">
      <div className="visual-glow" />

      <div className="floating-tag tag-top">
        <span className="tag-icon"><BadgeCheck size={16} /></span>
        <span>Verified rental record</span>
      </div>

      <div className="preview-card">
        <div className="preview-top">
          <div>
            <span className="eyebrow">PROPERTY OVERVIEW</span>
            <h3>Maple Residency</h3>
            <p><MapPin size={13} /> Pune, Maharashtra</p>
          </div>
          <span className="active-status">
            <span /> Active
          </span>
        </div>

        <div className="preview-divider" />

        <div className="preview-stats">
          <div>
            <span className="stat-label">Monthly rent</span>
            <strong>₹15,000</strong>
          </div>
          <div>
            <span className="stat-label">Security deposit</span>
            <strong>₹30,000</strong>
          </div>
        </div>

        <div className="preview-divider" />

        <div className="inspection-heading">
          <div>
            <span className="eyebrow">PROPERTY RECORD</span>
            <h4>Move-in inspection</h4>
          </div>
          <span className="completed-pill"><Check size={12} /> Completed</span>
        </div>

        <div className="inspection-list">
          <div className="inspection-row">
            <span className="inspection-icon"><Home size={17} /></span>
            <span>Living room</span>
            <span className="recorded">Recorded</span>
          </div>
          <div className="inspection-row">
            <span className="inspection-icon"><Camera size={17} /></span>
            <span>Bedroom</span>
            <span className="recorded">Recorded</span>
          </div>
          <div className="inspection-row">
            <span className="inspection-icon"><ClipboardCheck size={17} /></span>
            <span>Kitchen</span>
            <span className="recorded">Recorded</span>
          </div>
        </div>

        <div className="preview-footer">
          <span><LockKeyhole size={13} /> Shared documentation</span>
          <span>View record <ArrowUpRight size={13} /></span>
        </div>
      </div>

      <div className="floating-tag tag-bottom">
        <div className="success-icon"><Check size={15} /></div>
        <div>
          <strong>Everything documented.</strong>
          <span>One transparent rental journey.</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero-copy">
        <div className="hero-label">
          <Sparkles size={14} />
          A smarter way to rent
        </div>

        <h1>
          Renting should be
          <br />
          built on <span>trust.</span>
        </h1>

        <p className="hero-description">
          Your rental journey, documented from day one.
          Keep property inspections, maintenance and security
          deposits transparent with everything in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="primary-button">
  Explore RentSure <ArrowUpRight size={17} />
</Link>
          <a href="#how-it-works" className="secondary-button">
            See how it works <ArrowRight size={16} />
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-avatars">
            <span>T</span>
            <span>L</span>
            <span>R</span>
          </div>
          <div>
            <strong>Built for both sides</strong>
            <p>Tenants and landlords, together.</p>
          </div>
        </div>
      </div>

      <HeroPreview />
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip">
      <div><ShieldCheck /> Documented transparency</div>
      <div><Camera /> Visual property records</div>
      <div><Wallet /> Clear deposit records</div>
      <div><LockKeyhole /> Accountable rental history</div>
    </section>
  );
}

function Features() {
  return (
    <section className="features section" id="features">
      <div className="section-heading">
        <span className="eyebrow">WHAT WE BRING TO THE TABLE</span>
        <h2>More clarity. Less conflict.</h2>
        <p>
          Every important part of renting deserves a proper record.
          RentSure keeps the entire journey organized and transparent.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article className="feature-card" key={feature.number}>
              <div className="feature-top">
                <div className="feature-icon"><Icon size={23} /></div>
                <span>{feature.number}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <a href="#get-started" aria-label={`Explore ${feature.title}`}>
                Explore feature <ChevronRight size={16} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="how-section section" id="how-it-works">
      <div className="how-intro">
        <span className="eyebrow">SIMPLE BY DESIGN</span>
        <h2>From move-in to move-out.</h2>
        <p>
          A clear process that keeps everyone on the same page
          throughout the rental relationship.
        </p>
        <a href="#get-started" className="text-link">
          Start your journey <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="steps-list">
        {steps.map((step) => (
          <div className="step" key={step.number}>
            <span className="step-number">{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <ArrowUpRight className="step-arrow" size={19} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="audience section">
      <div className="section-heading">
        <span className="eyebrow">ONE PLATFORM, TWO PERSPECTIVES</span>
        <h2>Better for everyone involved.</h2>
      </div>

      <div className="audience-grid">
        <article className="audience-card tenant-card">
          <div className="audience-icon"><Users size={25} /></div>
          <span className="eyebrow">FOR TENANTS</span>
          <h3>Know your rental. Protect your peace.</h3>
          <p>
            Keep your inspection records, maintenance requests and
            deposit details organized and accessible.
          </p>
          <ul>
            <li><Check /> Document existing property conditions</li>
            <li><Check /> Track maintenance requests</li>
            <li><Check /> Review itemized deposit settlements</li>
          </ul>
        </article>

        <article className="audience-card landlord-card">
          <div className="audience-icon"><Building2 size={25} /></div>
          <span className="eyebrow">FOR LANDLORDS</span>
          <h3>Manage properties with confidence.</h3>
          <p>
            Maintain organized property records and communicate
            clearly with tenants at every stage.
          </p>
          <ul>
            <li><Check /> Organize property inspections</li>
            <li><Check /> Manage maintenance activity</li>
            <li><Check /> Document transparent settlements</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta section" id="get-started">
      <div className="cta-content">
        <span className="eyebrow">A BETTER RENTAL EXPERIENCE STARTS HERE</span>
        <h2>Let's make renting more transparent.</h2>
        <p>
          A shared record today can prevent a misunderstanding tomorrow.
        </p>
        <a href="#contact" className="cta-button">
          Discover RentSure <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="cta-decoration"><ShieldCheck /></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-main">
        <a href="#" className="brand footer-brand">
          <span className="brand-icon"><ShieldCheck size={22} /></span>
          <span>rent<span className="brand-accent">sure</span></span>
        </a>
        <p>Rental transparency. Documented trust.</p>
      </div>
      <div className="footer-bottom">
        <span>© 2026 RentSure. All rights reserved.</span>
        <span>Designed for a more transparent rental experience.</span>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <Audience />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/tenant/dashboard"
  element={<Dashboard role="tenant" />}
/>

<Route
  path="/landlord/dashboard"
  element={<Dashboard role="landlord" />}
/>
      </Routes>
    </BrowserRouter>
  );
}
