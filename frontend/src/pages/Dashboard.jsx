import {
  ShieldCheck, LayoutDashboard, Building2, Users, Camera,
  Wrench, Wallet, FileText, Settings, Bell, Search,
  ArrowUpRight, ArrowRight, CheckCircle2, ChevronRight, Plus,
  MapPin, MoreHorizontal, Menu, Home
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const tenantActivities = [
  { icon: Camera, title: "Move-in inspection completed", detail: "Living room and bedroom records", time: "Today, 10:30 AM", status: "Completed" },
  { icon: Wrench, title: "Maintenance request updated", detail: "Bathroom tap leakage", time: "Yesterday", status: "In progress" },
  { icon: Wallet, title: "Monthly rent recorded", detail: "November 2026", time: "Nov 1, 2026", status: "Recorded" }
];

const landlordActivities = [
  { icon: Users, title: "New tenant joined", detail: "Maple Residency · Room 204", time: "Today, 11:15 AM", status: "Completed" },
  { icon: Wrench, title: "Maintenance request received", detail: "Bathroom tap leakage", time: "Today, 09:40 AM", status: "Pending" },
  { icon: Camera, title: "Inspection acknowledged", detail: "Maple Residency · Room 204", time: "Yesterday", status: "Completed" }
];

function Sidebar({ role, active, setActive, open, setOpen, userName }) {
  const tenantItems = [
    { label: "Overview", icon: LayoutDashboard, id: "overview" },
    { label: "My rental", icon: Home, id: "rental" },
    { label: "Inspections", icon: Camera, id: "inspections" },
    { label: "Maintenance", icon: Wrench, id: "maintenance" },
    { label: "My deposit", icon: Wallet, id: "deposit" },
    { label: "Documents", icon: FileText, id: "documents" }
  ];

  const landlordItems = [
    { label: "Overview", icon: LayoutDashboard, id: "overview" },
    { label: "Properties", icon: Building2, id: "properties" },
    { label: "Tenants", icon: Users, id: "tenants" },
    { label: "Inspections", icon: Camera, id: "inspections" },
    { label: "Maintenance", icon: Wrench, id: "maintenance" },
    { label: "Settlements", icon: Wallet, id: "settlements" },
    { label: "Documents", icon: FileText, id: "documents" }
  ];

  const items = role === "tenant" ? tenantItems : landlordItems;

  return (
    <>
      {open && <button className="sidebar-overlay" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <aside className={`dashboard-sidebar ${open ? "sidebar-open" : ""}`}>
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon"><ShieldCheck size={22} /></span>
          <span>rent<span>sure</span></span>
        </Link>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <a
  key={item.id}
  href={`#${item.id}`}
  className={active === item.id ? "sidebar-link active" : "sidebar-link"}
  onClick={(e) => {
    e.preventDefault();
    setActive(item.id);
    setOpen(false);
  }}
>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "maintenance" && (
                  <span className="sidebar-count">2</span>
                )}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-label">PREFERENCES</div>
          <a
  href="#settings"
  className={active === "settings" ? "sidebar-link active" : "sidebar-link"}
  onClick={(e) => {
    e.preventDefault();
    setActive("settings");
    setOpen(false);
  }}
>
            <Settings size={18} /> Settings
          </a>

          <div className="sidebar-profile">
            <div className="profile-avatar">{role === "tenant" ? "T" : "L"}</div>
            <div className="profile-info">
              <strong>{userName}</strong>
              <span>{role === "tenant" ? "Tenant account" : "Landlord account"}</span>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>
    </>
  );
}
function DashboardHeader({ role, setOpen, userName }) {
  return (
    <header className="dashboard-header">
      <button className="dashboard-menu" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={21} />
      </button>

      <div className="dashboard-breadcrumb">
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>Overview</strong>
      </div>

      <div className="dashboard-header-actions">
        <div className="dashboard-search">
          <Search size={16} />
          <input placeholder="Search anything..." aria-label="Search" />
          <span>⌘ K</span>
        </div>

        <button className="notification-button" aria-label="Notifications">
          <Bell size={19} />
          <i />
        </button>

        <div className="header-user">
          <div className="profile-avatar">{role === "tenant" ? "T" : "L"}</div>
          <span>{userName}</span>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ label, value, note, icon: Icon, trend, tone }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <div className={`metric-icon ${tone}`}><Icon size={20} /></div>
      </div>
      <strong className="metric-value">{value}</strong>
      <div className="metric-bottom">
        {trend && <span className="metric-trend"><ArrowUpRight size={13} /> {trend}</span>}
        <span>{note}</span>
      </div>
    </article>
  );
}

function ActivityList({ activities }) {
  return (
    <div className="activity-list">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        return (
          <div className="activity-item" key={index}>
            <div className="activity-icon"><Icon size={17} /></div>
            <div className="activity-description">
              <strong>{activity.title}</strong>
              <p>{activity.detail}</p>
              <span>{activity.time}</span>
            </div>
            <span className={`activity-status ${activity.status === "Pending" ? "pending" : activity.status === "In progress" ? "progress" : "completed"}`}>
              {activity.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TenantDashboard({
  setActive,
  leases,
  payments,
  deposits,
  maintenance,
  userName
}) {
  const lease = leases.find(l => l.status === "active") || leases[0];
  const deposit = deposits[0];
  const openRequests = maintenance.filter(m => m.status !== "resolved").length;

  const money = value =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;
  return (
    <>
      <div className="welcome-row" id="overview">
        <div>
          <span className="dashboard-eyebrow">THURSDAY, NOVEMBER 6, 2026</span>
          <h1>Good evening, {userName} <span>👋</span></h1>
          <p>Here's what's happening with your rental today.</p>
        </div>
        <button className="dashboard-primary-button" onClick={() => setActive("maintenance")}>
          <Plus size={17} /> Report an issue
        </button>
      </div>
      <section className="metric-grid">
        <MetricCard label="Monthly rent" value={money(lease?.monthly_rent)} note={lease ? "Current rental" : "No active lease"} icon={Wallet} tone="green" />
        <MetricCard label="Security deposit" value={money(deposit?.initial_amount)} note={deposit?.status || "Not recorded"} icon={ShieldCheck} tone="purple" />
        <MetricCard label="Open requests" value={String(openRequests).padStart(2, "0")} note="Maintenance requests" icon={Wrench} tone="orange" />
        <MetricCard label="Payment records" value={String(payments.length).padStart(2, "0")} note="Recorded payments" icon={Camera} tone="blue" />
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-panel rental-panel" id="rental">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR CURRENT RENTAL</span>
              <h2>{lease?.property_name || "Your rental property"}</h2>
            </div>
            <span className="lease-active"><i /> Active lease</span>
          </div>

          <div className="property-visual">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=85"
              alt="Modern apartment interior"
            />
            <span className="property-tag"><Home size={13} /> Apartment</span>
          </div>

          <div className="property-location"><MapPin size={15} /> {lease?.address || lease?.city || "Property location not available"}</div>

          <div className="rental-detail-grid">
            <div><span>Monthly rent</span><strong>{money(lease?.monthly_rent)}</strong></div>
            <div><span>Security deposit</span><strong>{money(deposit?.initial_amount)}</strong></div>
            <div><span>Lease started</span><strong>{lease?.start_date ? String(lease.start_date).slice(0, 10) : "—"}</strong></div>
            <div><span>Lease ends</span><strong>{lease?.end_date ? String(lease.end_date).slice(0, 10) : "—"}</strong></div>
          </div>

          <a href="#documents" className="panel-link" onClick={() => setActive("documents")}>
            View rental details <ArrowUpRight size={15} />
          </a>
        </article>

        <article className="dashboard-panel inspection-panel" id="inspections">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">PROPERTY DOCUMENTATION</span>
              <h2>Inspection progress</h2>
            </div>
            <button className="icon-button" aria-label="Inspection options"><MoreHorizontal /></button>
          </div>

          <div className="inspection-progress">
            <div className="progress-circle">
              <div><strong>100%</strong><span>Complete</span></div>
            </div>
            <p>Your move-in inspection has been completed and acknowledged.</p>
          </div>

          <div className="inspection-checks">
            <div><CheckCircle2 /> Living room <span>Recorded</span></div>
            <div><CheckCircle2 /> Bedroom <span>Recorded</span></div>
            <div><CheckCircle2 /> Kitchen <span>Recorded</span></div>
            <div><CheckCircle2 /> Bathroom <span>Recorded</span></div>
          </div>

          <a href="#inspections" className="panel-link">
            View inspection records <ArrowUpRight size={15} />
          </a>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel" id="maintenance">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">SERVICE UPDATES</span>
              <h2>Maintenance requests</h2>
            </div>
            <button className="text-action" onClick={() => setActive("maintenance")}>View all <ArrowRight size={14} /></button>
          </div>

          {maintenance.length === 0 ? (
            <p>No maintenance requests found.</p>
          ) : maintenance.slice(0, 3).map((item) => (
            <div className="request-card" key={item.request_id}>
              <div className="request-icon orange"><Wrench size={18} /></div>
              <div className="request-info">
                <strong>{item.title}</strong>
                <span>{item.created_at ? String(item.created_at).slice(0, 10) : "Date unavailable"} · #{item.request_id}</span>
              </div>
              <span className={`activity-status ${String(item.status).toLowerCase() === "resolved" ? "completed" : "progress"}`}>{item.status}</span>
            </div>
          ))}
        </article>
        <article className="dashboard-panel deposit-panel" id="deposit">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">FINANCIAL OVERVIEW</span>
              <h2>Deposit record</h2>
            </div>
            <Wallet size={19} className="panel-heading-icon" />
          </div>
          <div className="deposit-amount">{money(deposit?.initial_amount)}</div>
          <p className="deposit-caption">Recorded security deposit</p>
          <div className="deposit-divider" />
          <div className="deposit-row"><span>Initial deposit</span><strong>{money(deposit?.initial_amount)}</strong></div>
          <div className="deposit-row"><span>Proposed deductions</span><strong>{money(deposit?.deduction_amount)}</strong></div>
          <div className="deposit-row"><span>Current recorded balance</span><strong className="green-text">{money(Number(deposit?.initial_amount || 0) - Number(deposit?.deduction_amount || 0))}</strong></div>
          <span className="deposit-note"><ShieldCheck size={14} /> Settlement has not started</span>
        </article>
      </section>

      <section className="dashboard-panel activity-panel" id="documents">
        <div className="panel-heading">
          <div>
            <span className="dashboard-eyebrow">YOUR RENTAL TIMELINE</span>
            <h2>Recent activity</h2>
          </div>
          <button className="text-action" onClick={() => setActive("documents")}>All activity <ArrowRight size={14} /></button>
        </div>
        <ActivityList activities={tenantActivities} />
      </section>
    </>
  );
}

function LandlordDashboard({ setActive, stats, loading, error }) {
  return (
    <>
      <div className="welcome-row" id="overview">
        <div>
          <span className="dashboard-eyebrow">THURSDAY, NOVEMBER 6, 2026</span>
          <h1>Welcome back, Jordan <span>👋</span></h1>
          <p>Here's an overview of your rental properties.</p>
        </div>
        <button className="dashboard-primary-button" onClick={() => setActive("properties")}>
          <Plus size={17} /> Add property
        </button>
      </div>

      <section className="metric-grid">
  <MetricCard
    label="Total properties"
    value={loading ? "..." : stats?.total_properties ?? 0}
    note="Registered properties"
    icon={Building2}
    tone="green"
  />

  <MetricCard
    label="Active tenants"
    value={loading ? "..." : stats?.total_tenants ?? 0}
    note="Currently active leases"
    icon={Users}
    tone="blue"
  />

  <MetricCard
    label="Monthly rental income"
    value={
      loading
        ? "..."
        : `₹${Number(stats?.rent_collected_this_month ?? 0).toLocaleString("en-IN")}`
    }
    note="Rent collected this month"
    icon={Wallet}
    tone="purple"
  />

  <MetricCard
    label="Open requests"
    value={loading ? "..." : stats?.open_maintenance_requests ?? 0}
    note="Require attention"
    icon={Wrench}
    tone="orange"
  />
</section>

{error && (
  <p className="auth-message error">{error}</p>
)}
      <section className="dashboard-content-grid">
        <article className="dashboard-panel landlord-properties" id="properties">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">PROPERTY PORTFOLIO</span>
              <h2>Your properties</h2>
            </div>
            <button className="text-action" onClick={() => setActive("properties")}>View all <ArrowRight size={14} /></button>
          </div>

          <div className="landlord-property-row">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&auto=format&fit=crop&q=80" alt="Maple Residency" />
            <div className="landlord-property-info">
              <strong>Maple Residency</strong>
              <span><MapPin size={12} /> Baner, Pune</span>
              <small>6 units · 5 occupied</small>
            </div>
            <span className="lease-active"><i /> Active</span>
          </div>
          <div className="landlord-property-row">
            <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300&auto=format&fit=crop&q=80" alt="Greenwood Apartments" />
            <div className="landlord-property-info">
              <strong>Greenwood Apartments</strong>
              <span><MapPin size={12} /> Wakad, Pune</span>
              <small>5 units · 4 occupied</small>
            </div>
            <span className="lease-active"><i /> Active</span>
          </div>

          <div className="landlord-property-row">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=300&auto=format&fit=crop&q=80" alt="Oakwood Homes" />
            <div className="landlord-property-info">
              <strong>Oakwood Homes</strong>
              <span><MapPin size={12} /> Hinjewadi, Pune</span>
              <small>4 units · 3 occupied</small>
            </div>
            <span className="lease-active"><i /> Active</span>
          </div>
        </article>

        <article className="dashboard-panel landlord-summary" id="tenants">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">PORTFOLIO SNAPSHOT</span>
              <h2>Occupancy overview</h2>
            </div>
            <Users size={19} className="panel-heading-icon" />
          </div>

          <div className="occupancy-number">80% <span>occupied</span></div>
          <div className="occupancy-bar"><div /></div>
          <div className="occupancy-legend">
            <span><i className="occupied-dot" /> 12 Occupied</span>
            <span><i className="vacant-dot" /> 3 Vacant</span>
          </div>

          <div className="summary-divider" />
          <div className="summary-stat">
            <span>Active tenants</span><strong>12</strong>
          </div>
          <div className="summary-stat">
            <span>Pending settlements</span><strong>01</strong>
          </div>
          <div className="summary-stat">
            <span>Inspections awaiting acknowledgement</span><strong>02</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel" id="maintenance">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">NEEDS ATTENTION</span>
              <h2>Maintenance requests</h2>
            </div>
            <button className="text-action" onClick={() => setActive("maintenance")}>View all <ArrowRight size={14} /></button>
          </div>
          <div className="request-card">
            <div className="request-icon orange"><Wrench size={18} /></div>
            <div className="request-info">
              <strong>Bathroom tap leakage</strong>
              <span>Maple Residency · Room 204</span>
            </div>
            <span className="activity-status pending">Pending</span>
          </div>
          <div className="request-card">
            <div className="request-icon blue"><Wrench size={18} /></div>
            <div className="request-info">
              <strong>Electrical inspection</strong>
              <span>Greenwood · Room 103</span>
            </div>
            <span className="activity-status progress">Assigned</span>
          </div>
          <div className="request-card">
            <div className="request-icon green"><CheckCircle2 size={18} /></div>
            <div className="request-info">
              <strong>Kitchen light replacement</strong>
              <span>Oakwood Homes · Room 301</span>
            </div>
            <span className="activity-status completed">Resolved</span>
          </div>
        </article>

        <article className="dashboard-panel" id="settlements">
          <div className="panel-heading">
            <div>
              <span className="dashboard-eyebrow">FINANCIAL RECORDS</span>
              <h2>Deposit settlements</h2>
            </div>
            <Wallet size={19} className="panel-heading-icon" />
          </div>
          <div className="settlement-highlight">
            <span>Awaiting review</span>
            <strong>01</strong>
            <p>One settlement requires your attention.</p>
          </div>
          <div className="summary-stat">
            <span>Active deposit records</span><strong>12</strong>
          </div>
          <div className="summary-stat">
            <span>Completed settlements</span><strong>04</strong>
          </div>
          <button className="settlement-button" onClick={() => setActive("settlements")}>
            Review settlements <ArrowRight size={15} />
          </button>
        </article>
      </section>
<section className="dashboard-panel activity-panel" id="documents">
        <div className="panel-heading">
          <div>
            <span className="dashboard-eyebrow">PORTFOLIO UPDATES</span>
            <h2>Recent activity</h2>
          </div>
          <button className="text-action" onClick={() => setActive("documents")}>All activity <ArrowRight size={14} /></button>
        </div>
        <ActivityList activities={landlordActivities} />
      </section>
    </>
  );
}
function SectionPage({ active, role }) {
  const tenantPages = {
    rental: ["My Rental", "View your property, lease details and rental information."],
    inspections: ["Inspections", "Manage move-in and move-out property inspections."],
    maintenance: ["Maintenance", "Report issues and track maintenance requests."],
    deposit: ["My Deposit", "View your security deposit and settlement records."],
    documents: ["Documents", "Access your rental agreements and important documents."],
    settings: ["Settings", "Manage your account and preferences."]
  };

  const landlordPages = {
    properties: ["Properties", "Manage your properties and rental units."],
    tenants: ["Tenants", "View tenant information and occupancy records."],
    inspections: ["Inspections", "Review property inspections and tenant acknowledgements."],
    maintenance: ["Maintenance", "Manage incoming maintenance requests."],
    settlements: ["Settlements", "Review security deposits and proposed deductions."],
    documents: ["Documents", "Manage property and rental documents."],
    settings: ["Settings", "Manage your account and preferences."]
  };

  const pages = role === "tenant" ? tenantPages : landlordPages;
  const page = pages[active];

  return (
    <div className="welcome-row">
      <div>
        <span className="dashboard-eyebrow">
          {role === "tenant" ? "TENANT WORKSPACE" : "LANDLORD WORKSPACE"}
        </span>
        <h1>{page ? page[0] : "Page not found"}</h1>
        <p>{page ? page[1] : "Select a section from the sidebar."}</p>
      </div>
    </div>
  );
}
function PropertiesPage({ properties, loading, error }) {
  return (
    <section className="dashboard-panel" style={{ padding: "24px" }}>
      <div className="panel-heading">
        <div>
          <span className="dashboard-eyebrow">PROPERTY PORTFOLIO</span>
          <h2>Your properties</h2>
          <p>Properties registered under your account.</p>
        </div>
        <Building2 size={22} />
      </div>

      {loading && <p>Loading properties...</p>}

      {error && <p className="auth-message error">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p>No properties added yet.</p>
      )}

      <div style={{ display: "grid", gap: "14px" }}>
        {properties.map((property) => (
          <article
            key={property.property_id}
            style={{
              padding: "18px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px"
            }}
          >
            <h3>{property.property_name}</h3>
            <p>
              <MapPin size={14} style={{ verticalAlign: "middle" }} />
              {" "}{property.address}, {property.city}
            </p>
            <p>Type: {property.property_type || "Not specified"}</p>
            <p>Total units: {property.total_units}</p>
            <small>Property ID: {property.property_id}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
function TenantsPage({ leases, loading, error }) {
  return (
    <section className="dashboard-panel" style={{ padding: "24px" }}>
      <div className="panel-heading">
        <div>
          <span className="dashboard-eyebrow">TENANT MANAGEMENT</span>
          <h2>Your tenants</h2>
          <p>Tenant and rental agreement information.</p>
        </div>
        <Users size={22} />
      </div>

      {loading && <p>Loading tenant records...</p>}

      {error && <p className="auth-message error">{error}</p>}

      {!loading && !error && leases.length === 0 && (
        <p>No lease records found yet.</p>
      )}
      {!loading && leases.map((lease) => (
        <article
          key={lease.lease_id}
          style={{
            padding: "18px",
            marginTop: "14px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px"
          }}
        >
          <h3>{lease.tenant_name}</h3>
          <p>{lease.tenant_email}</p>
          <p><strong>Property:</strong> {lease.property_name}</p>
          <p><strong>Monthly rent:</strong> ₹{Number(lease.monthly_rent).toLocaleString("en-IN")}</p>
          <p><strong>Start:</strong> {String(lease.start_date).slice(0, 10)}</p>
          <p><strong>End:</strong> {String(lease.end_date).slice(0, 10)}</p>
          <span className="lease-active">{lease.status}</span>
          <p><small>Lease ID: {lease.lease_id}</small></p>
        </article>
      ))}
    </section>
  );
}
function MaintenancePage({ maintenance, loading, error }) {
  return (
    <section className="dashboard-panel" style={{ padding: "24px" }}>
      <span className="dashboard-eyebrow">PROPERTY SERVICES</span>
      <h2>Maintenance requests</h2>
      <p>Track and manage maintenance reported for your properties.</p>

      {loading && <p>Loading maintenance requests...</p>}
      {error && <p className="auth-message error">{error}</p>}

      {!loading && !error && maintenance.length === 0 && (
        <p>No maintenance requests found.</p>
      )}

      {maintenance.map((item) => (
        <article key={item.request_id} style={{
          padding: "16px",
          marginTop: "14px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px"
        }}>
          <h3>{item.title}</h3>
          <p>{item.description || "No description provided."}</p>
          <p><strong>Property:</strong> {item.property_name}</p>
          <p><strong>Tenant:</strong> {item.tenant_name}</p>
          <p><strong>Priority:</strong> {item.priority}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <small>Request #{item.request_id}</small>
        </article>
      ))}
    </section>
  );
}
function DepositsPage({ deposits, loading, error }) {
  return (
    <section className="dashboard-panel" style={{ padding: "24px" }}>
      <span className="dashboard-eyebrow">FINANCIAL RECORDS</span>
      <h2>Security deposits</h2>
      <p>Review deposit balances and settlement records.</p>

      {loading && <p>Loading deposit records...</p>}
      {error && <p className="auth-message error">{error}</p>}

      {!loading && !error && deposits.length === 0 && (
        <p>No security deposits found.</p>
      )}

      {deposits.map((deposit) => (
        <article key={deposit.deposit_id} style={{
          padding: "16px",
          marginTop: "14px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px"
        }}>
          <h3>{deposit.property_name}</h3>
          <p><strong>Tenant:</strong> {deposit.tenant_name}</p>
          <p>
            <strong>Initial deposit:</strong>{" "}
            ₹{Number(deposit.initial_amount).toLocaleString("en-IN")}
          </p>
          <p>
            <strong>Deductions:</strong>{" "}
            ₹{Number(deposit.deduction_amount).toLocaleString("en-IN")}
          </p>
          <p>
            <strong>Refund:</strong>{" "}
            ₹{Number(deposit.refund_amount).toLocaleString("en-IN")}
          </p>
          <p><strong>Status:</strong> {deposit.status}</p>
          <small>Deposit #{deposit.deposit_id}</small>
        </article>
      ))}
    </section>
  );
}
export default function Dashboard({ role = "tenant" }) {
  const storedUser = JSON.parse(
  localStorage.getItem("rentsure_user") || "{}"
);

const userName = storedUser.full_name || "User";
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState("");

  const [leases, setLeases] = useState([]);
  const [leasesLoading, setLeasesLoading] = useState(false);
  const [leasesError, setLeasesError] = useState("");

  const [maintenance, setMaintenance] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [tenantPayments, setTenantPayments] = useState([]);

  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState("");
  const [depositError, setDepositError] = useState("");

  const isTenant = role === "tenant";

  // Landlord overview statistics
  useEffect(() => {
    if (role !== "landlord") return;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/dashboard");
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [role]);

  // Tenant's own rental, payment, deposit and maintenance records
  useEffect(() => {
    if (role !== "tenant") return;

    const loadTenantData = async () => {
      try {
        const [leaseRes, paymentRes, depositRes, maintenanceRes] = await Promise.all([
          api.get("/leases"),
          api.get("/payments"),
          api.get("/deposits"),
          api.get("/maintenance")
        ]);

        setLeases(leaseRes.data.data || []);
        setTenantPayments(paymentRes.data.data || []);
        setDeposits(depositRes.data.data || []);
        setMaintenance(maintenanceRes.data.data || []);
      } catch (err) {
        console.error("Unable to load tenant dashboard data:", err);
      }
    };

    loadTenantData();
  }, [role]);

  // Landlord properties
  useEffect(() => {
    if (role !== "landlord" || active !== "properties") return;

    const loadProperties = async () => {
      try {
        setPropertiesLoading(true);
        setPropertiesError("");
        const res = await api.get("/properties");
        setProperties(res.data.data || []);
      } catch (err) {
        setPropertiesError(err.response?.data?.message || "Unable to load properties.");
      } finally {
        setPropertiesLoading(false);
      }
    };

    loadProperties();
  }, [role, active]);

  // Landlord tenant records
  useEffect(() => {
    if (role !== "landlord" || active !== "tenants") return;

    const loadLeases = async () => {
      try {
        setLeasesLoading(true);
        setLeasesError("");
        const res = await api.get("/leases");
        setLeases(res.data.data || []);
      } catch (err) {
        setLeasesError(err.response?.data?.message || "Unable to load tenant records.");
      } finally {
        setLeasesLoading(false);
      }
    };

    loadLeases();
  }, [role, active]);

  // Landlord maintenance and deposit records
  useEffect(() => {
    if (role !== "landlord") return;

    const loadRecords = async () => {
      try {
        setMaintenanceLoading(true);
        setDepositLoading(true);
        setMaintenanceError("");
        setDepositError("");

        const [maintenanceRes, depositRes] = await Promise.all([
          api.get("/maintenance"),
          api.get("/deposits")
        ]);

        setMaintenance(maintenanceRes.data.data || []);
        setDeposits(depositRes.data.data || []);
      } catch (err) {
        const message = err.response?.data?.message || "Unable to load records.";
        setMaintenanceError(message);
        setDepositError(message);
      } finally {
        setMaintenanceLoading(false);
        setDepositLoading(false);
      }
    };

    loadRecords();
  }, [role]);

  return (
    <div className="dashboard-layout">
      <Sidebar
        role={role}
        userName={userName}
        active={active}
        setActive={setActive}
        open={menuOpen}
        setOpen={setMenuOpen}
      />

      <main className="dashboard-main">
        <DashboardHeader
         role={role} 
         setOpen={setMenuOpen} 
         userName={userName}/>

        <div className="dashboard-content">
          {active === "overview" ? (
            isTenant ? (
              <TenantDashboard
                setActive={setActive}
                leases={leases}
                payments={tenantPayments}
                deposits={deposits}
                maintenance={maintenance}
                userName={userName}
              />
            ) : (
              <LandlordDashboard
                setActive={setActive}
                stats={stats}
                loading={loading}
                error={error}
                userName={userName}
              />
            )
          ) : active === "properties" && role === "landlord" ? (
            <PropertiesPage
              properties={properties}
              loading={propertiesLoading}
              error={propertiesError}
            />
          ) : active === "tenants" && role === "landlord" ? (
            <TenantsPage
              leases={leases}
              loading={leasesLoading}
              error={leasesError}
            />
          ) : active === "maintenance" && role === "landlord" ? (
            <MaintenancePage
              maintenance={maintenance}
              loading={maintenanceLoading}
              error={maintenanceError}
            />
          ) : active === "settlements" && role === "landlord" ? (
            <DepositsPage
              deposits={deposits}
              loading={depositLoading}
              error={depositError}
            />
          ) : (
            <SectionPage active={active} role={role} />
          )}

          <footer className="dashboard-footer">
            <span>© 2026 RentSure</span>
            <span>Rental transparency. Documented trust.</span>
            <Link to="/">
              Back to website <ArrowUpRight size={13} />
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
