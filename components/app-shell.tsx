"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Grid2X2,
  Menu,
  Package,
  QrCode,
  Settings,
  X,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Grid2X2 },
  { href: "/batches", label: "QR Batches", icon: ClipboardList },
  { href: "/inventory", label: "QR Inventory", icon: Package },
];
export function AppShell({
  children,
  active = "Dashboard",
  crumb = "Overview",
}: {
  children: React.ReactNode;
  active?: string;
  crumb?: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = (
    <>
      <Link href="/dashboard" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark">
          <QrCode size={17} />
        </span>{" "}
        tagflow
      </Link>
      <p className="workspace">Operations</p>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          href={href}
          className={`nav-link ${active === label ? "active" : ""}`}
          key={href}
          onClick={() => setMenuOpen(false)}
        >
          <Icon />
          {label}
        </Link>
      ))}
      <div className="nav-bottom">
        <a className="nav-link" href="#" onClick={() => setMenuOpen(false)}>
          <Settings />
          Settings
        </a>
        <a className="nav-link" href="#" onClick={() => setMenuOpen(false)}>
          <CircleHelp />
          Help & support
        </a>
      </div>
    </>
  );
  return (
    <div className="app-shell">
      <aside className="sidebar">{navigation}</aside>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`mobile-sidebar ${menuOpen ? "open" : ""}`} aria-label="Mobile navigation">
        <div className="mobile-sidebar-head">
          <span className="workspace">Menu</span>
          <button
            className="icon-button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        {navigation}
      </aside>
      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="crumb">
            <span>QR Operations</span>
            <ChevronRight size={14} />
            <strong>{crumb}</strong>
            <ChevronRight size={14} className="crumb-route-separator" />
            <span className="crumb-route">{pathname}</span>
          </div>
          <div className="top-actions">
            <span className="help">Need help?</span>
            <div className="avatar">SK</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
export const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`badge ${status === "Generated" ? "badge-blue" : status === "Printed" || status === "In stock" ? "badge-green" : status === "Sent to printing" ? "badge-amber" : "badge-slate"}`}
  >
    {status}
  </span>
);
export function IconTile({ children }: { children: React.ReactNode }) {
  return <span className="stat-icon">{children}</span>;
}
