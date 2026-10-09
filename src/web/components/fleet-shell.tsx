import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import type { LucideIcon } from "lucide-react";
import { Activity, Bell, Boxes, FileBarChart, Gauge, Moon, Package, PanelLeft, Radio, Settings, ShieldCheck, Sun, Ticket, UploadCloud, UsersRound, X } from "lucide-react";

type FleetShellProps = { children: ReactNode };

type NavItem = { label: string; href: string; icon: LucideIcon; count?: string };
const navItems: NavItem[] = [
  { label: "Fleet", href: "/fleet", icon: Gauge },
  { label: "Alerts", href: "/alerts", icon: Bell, count: "03" },
  { label: "Tickets", href: "/tickets", icon: Ticket, count: "05" },
  { label: "Updates", href: "/updates", icon: UploadCloud },
  { label: "Parts", href: "/parts", icon: Package },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "Audit", href: "/audit", icon: ShieldCheck },
];

export function FleetShell({ children }: FleetShellProps) {
  const [location] = useLocation();
  const [dark, setDark] = useState(true);
  const [site, setSite] = useState("Reno Fulfillment");
  const [showNotifications, setShowNotifications] = useState(false);
  const [railOpen, setRailOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const currentLabel = navItems.find((item) => location.startsWith(item.href))?.label ?? (location.startsWith("/raas") ? "RaaS portal" : location.startsWith("/settings") ? "Settings" : "Fleet");

  return (
    <div className="app-shell">
      <aside className={`app-rail ${railOpen ? "is-open" : ""}`}>
        <div className="rail-brand">
          <img src="/falcon-logo.png" alt="FalconFleetOps falcon mark" />
          <div className="rail-wordmark"><strong>Falcon</strong><span>FleetOps</span></div>
          <button className="icon-button rail-close" aria-label="Close navigation" onClick={() => setRailOpen(false)}><X size={18} /></button>
        </div>
        <div className="rail-section-label">Operations</div>
        <nav className="rail-nav" aria-label="Primary navigation">
          {navItems.map(({ label, href, icon: Icon, count }) => {
            const active = location === href || (href !== "/fleet" && location.startsWith(href));
            return <Link key={href} href={href} className={`rail-link ${active ? "active" : ""}`} onClick={() => setRailOpen(false)}><Icon size={18} strokeWidth={active ? 2.4 : 1.8} /><span>{label}</span>{count && <em>{count}</em>}</Link>;
          })}
        </nav>
        <div className="rail-spacer" />
        <div className="rail-section-label">Workspace</div>
        <nav className="rail-nav">
          <Link href="/raas" className={`rail-link ${location.startsWith("/raas") ? "active" : ""}`}><UsersRound size={18} /><span>RaaS portal</span></Link>
          <Link href="/settings" className={`rail-link ${location.startsWith("/settings") ? "active" : ""}`}><Settings size={18} /><span>Settings</span></Link>
        </nav>
        <div className="rail-footnote"><span className="status-dot live" />Telemetry link stable<span className="mono">v0.9.6-demo</span></div>
      </aside>

      {railOpen && <button className="rail-scrim" aria-label="Close navigation" onClick={() => setRailOpen(false)} />}
      <section className="app-main">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button menu-button" aria-label="Open navigation" onClick={() => setRailOpen(true)}><PanelLeft size={20} /></button><div><span className="breadcrumb">Operations /</span><strong>{currentLabel}</strong></div></div>
          <div className="topbar-actions">
            <label className="site-picker"><Radio size={15} /><select value={site} onChange={(event) => setSite(event.target.value)} aria-label="Select site"><option>Reno Fulfillment</option><option>Columbus 3PL</option><option>Tilburg RaaS Hub</option></select></label>
            <button className="icon-button" aria-label="Toggle color theme" onClick={() => setDark((value) => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="icon-button notification-button" aria-label="Open notifications" onClick={() => setShowNotifications((value) => !value)}><Bell size={18} /><span className="notification-badge">3</span></button>
            <div className="user-chip"><span className="avatar">AS</span><span><strong>Andre Singh</strong><small>Ops Manager</small></span></div>
          </div>
        </header>
        {showNotifications && <div className="notification-popover"><div className="popover-heading"><strong>Needs attention</strong><span>3 open</span></div><div className="notification-item critical"><span className="status-dot" /><div><strong>AMR-008 motor ramp</strong><p>Safety threshold in 12 minutes</p></div><span className="mono">8m</span></div><div className="notification-item"><span className="status-dot amber" /><div><strong>Canary rollout ready</strong><p>20% health gate passed</p></div><span className="mono">19m</span></div><div className="notification-item"><span className="status-dot blue" /><div><strong>Parts RFQ received</strong><p>BRG-6204-2RS · 2 suppliers</p></div><span className="mono">1h</span></div></div>}
        <main className="page-content">{children}</main>
      </section>
    </div>
  );
}

export function StatusDot({ status }: { status: string }) {
  return <span className={`status-dot ${status}`} aria-label={status} />;
}

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-header"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="section-action">{action}</div>}</div>;
}

export function MetricCard({ label, value, note, tone = "neutral", trend }: { label: string; value: string; note: string; tone?: string; trend?: string }) {
  return <div className={`metric-card ${tone}`}><div className="metric-label"><span>{label}</span>{trend && <span className="metric-trend">{trend}</span>}</div><strong className="metric-value">{value}</strong><span className="metric-note">{note}</span></div>;
}

export function Button({ children, variant = "secondary", onClick, disabled = false }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; onClick?: () => void; disabled?: boolean }) {
  return <button className={`button button-${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="toast" role="status"><Activity size={16} /><span>{message}</span><button className="toast-close" onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button></div>;
}

export function DataBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`data-badge ${tone}`}>{children}</span>;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><Boxes size={25} /><strong>{title}</strong><p>{text}</p></div>;
}

export function Mono({ children }: { children: ReactNode }) { return <span className="mono">{children}</span>; }
