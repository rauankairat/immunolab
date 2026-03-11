"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./OwnerDashboard.module.css";

type Admin = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

type Patient = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  tests: {
    id: string;
    name: string;
    status: string;
    testedDay: string;
    testCode: string | null;
    resultUrl: string | null;
    location: string | null;
  }[];
};

type Order = {
  id: string;
  name: string;
  phone: string;
  branch: string;
  listType: string;
  express: boolean;
  total: number;
  pdfUrl: string;
  createdAt: string;
  count: number;
};

type Stats = {
  totalPatients: number;
  totalAdmins: number;
  totalTests: number;
  upcomingTests: number;
  totalOrders: number;
};

type Props = {
  admins: Admin[];
  patients: Patient[];
  orders: Order[];
  stats: Stats;
  ui: Record<string, string>;
};

type Tab = "overview" | "patients" | "orders" | "admins" | "whatsapp";

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: "#e8f5e9",
  CURRENT: "#fff8e1",
  PAST: "#f3f3f3",
};

const STATUS_TEXT: Record<string, string> = {
  UPCOMING: "#1a5319",
  CURRENT: "#b36b00",
  PAST: "#888",
};

export default function OwnerDashboard({ admins: initialAdmins, patients, orders, stats, ui }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("ADMIN");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [waNumber, setWaNumber] = useState("");
  const [waSaving, setWaSaving] = useState(false);
  const [waMsg, setWaMsg] = useState<string | null>(null);

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.branch.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.phone.includes(orderSearch)
  );

  async function handleAddAdmin() {
    if (!newAdminEmail.trim()) return;
    setAdminLoading(true);
    setAdminMsg(null);
    try {
      const res = await fetch("/api/owner/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail.trim(), role: newAdminRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins(prev => [...prev, data.user]);
      setNewAdminEmail("");
      setAdminMsg({ type: "success", text: ui.admin_added });
    } catch (e: any) {
      setAdminMsg({ type: "error", text: e.message || ui.admin_add_failed });
    } finally {
      setAdminLoading(false);
    }
  }

  async function handleDeleteAdmin(id: string) {
    if (!confirm(ui.remove_confirm)) return;
    try {
      await fetch(`/api/owner/admins/${id}`, { method: "DELETE" });
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch {
      alert(ui.remove_failed);
    }
  }

  async function handleChangeRole(id: string, role: string) {
    try {
      const res = await fetch(`/api/owner/admins/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      setAdmins(prev => prev.map(a => a.id === id ? { ...a, role: data.role } : a));
    } catch {
      alert(ui.role_update_failed);
    }
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: ui.tab_overview, icon: "📊" },
    { key: "patients", label: ui.tab_patients, icon: "🧪" },
    { key: "orders", label: ui.tab_orders, icon: "📋" },
    { key: "admins", label: ui.tab_admins, icon: "👥" },
    { key: "whatsapp", label: ui.tab_whatsapp, icon: "💬" },
  ];

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function updateHeight() {
      if (!sidebarRef.current) return;
      const footer = document.querySelector("footer");
      const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;
      const top = 108;
      const gap = 0.01; // ← change this for more/less bottom whitespace
      const bottom = footerTop < window.innerHeight
        ? footerTop - gap
        : window.innerHeight - gap;
      const height = bottom - top;
      console.log({ footerTop, bottom, height, gap });
      sidebarRef.current.style.height = `${bottom - top}px`;
    }
    updateHeight();
    window.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside ref={sidebarRef} className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.ownerBadge}>{ui.badge}</div>
            <p className={styles.sidebarTitle}>{ui.dashboard}</p>
          </div>
          <nav className={styles.sidebarNav}>
            {tabs.map(t => (
              <button
                key={t.key}
                className={`${styles.navItem} ${tab === t.key ? styles.navItemActive : ""}`}
                onClick={() => setTab(t.key)}
                type="button"
              >
                <span className={styles.navIcon}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>
      </div>
      <main className={styles.main}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className={styles.section}>
            <h1 className={styles.sectionTitle}>{ui.overview_title}</h1>
            <p className={styles.sectionSub}>{ui.overview_sub}</p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>👤</span>
                <strong className={styles.statNum}>{stats.totalPatients}</strong>
                <span className={styles.statLabel}>{ui.stat_patients}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🧪</span>
                <strong className={styles.statNum}>{stats.totalTests}</strong>
                <span className={styles.statLabel}>{ui.stat_tests}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>⏳</span>
                <strong className={styles.statNum}>{stats.upcomingTests}</strong>
                <span className={styles.statLabel}>{ui.stat_upcoming}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📋</span>
                <strong className={styles.statNum}>{stats.totalOrders}</strong>
                <span className={styles.statLabel}>{ui.stat_orders}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🛡️</span>
                <strong className={styles.statNum}>{stats.totalAdmins}</strong>
                <span className={styles.statLabel}>{ui.stat_admins}</span>
              </div>
            </div>
          </div>
        )}

        {/* PATIENTS & TESTS */}
        {tab === "patients" && (
          <div className={styles.section}>
            <h1 className={styles.sectionTitle}>{ui.patients_title}</h1>
            <input
              className={styles.searchInput}
              placeholder={ui.search_placeholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className={styles.list}>
              {filteredPatients.map(p => (
                <div key={p.id} className={styles.patientCard}>
                  <div
                    className={styles.patientHeader}
                    onClick={() => setExpandedPatient(expandedPatient === p.id ? null : p.id)}
                  >
                    <div className={styles.patientInfo}>
                      <div className={styles.patientAvatar}>
                        {(p.name?.[0] ?? p.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className={styles.patientName}>{p.name ?? ui.unknown}</p>
                        <p className={styles.patientEmail}>{p.email}</p>
                      </div>
                    </div>
                    <div className={styles.patientMeta}>
                      <span className={styles.testCount}>{p.tests.length}</span>
                      <span className={styles.chevron}>{expandedPatient === p.id ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  {expandedPatient === p.id && (
                    <div className={styles.testsTable}>
                      {p.tests.length === 0 ? (
                        <p className={styles.empty}>{ui.no_tests}</p>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>{ui.col_test}</th>
                              <th>{ui.col_branch}</th>
                              <th>{ui.col_date}</th>
                              <th>{ui.col_status}</th>
                              <th>{ui.col_result}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.tests.map(t => (
                              <tr key={t.id}>
                                <td>{t.name}</td>
                                <td>{t.location ?? "—"}</td>
                                <td>{new Date(t.testedDay).toLocaleDateString("ru-RU")}</td>
                                <td>
                                  <span className={styles.statusBadge} style={{
                                    background: STATUS_COLORS[t.status],
                                    color: STATUS_TEXT[t.status],
                                  }}>
                                    {t.status === "UPCOMING" ? ui.status_upcoming : t.status === "CURRENT" ? ui.status_current : ui.status_past}
                                  </span>
                                </td>
                                <td>
                                  {t.resultUrl ? (
                                    <a href={`/api/tests/${t.id}/result/view`} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
                                      {ui.view_pdf}
                                    </a>
                                  ) : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className={styles.section}>
            <h1 className={styles.sectionTitle}>{ui.orders_title}</h1>
            <p className={styles.sectionSub}>{orders.length}</p>
            <input
              className={styles.searchInput}
              placeholder={ui.orders_search}
              value={orderSearch}
              onChange={e => setOrderSearch(e.target.value)}
            />
            <div className={styles.list}>
              {filteredOrders.length === 0 && (
                <p className={styles.empty}>{ui.no_orders}</p>
              )}
              {filteredOrders.map(o => (
                <div key={o.id} className={styles.orderCard}>
                  <div className={styles.orderTop}>
                    <div className={styles.orderInfo}>
                      <div className={styles.patientAvatar} style={{ background: "#1a5319" }}>
                        {o.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className={styles.patientName}>{o.name}</p>
                        <p className={styles.patientEmail}>{o.phone} · {o.branch}</p>
                      </div>
                    </div>
                    <div className={styles.orderMeta}>
                      {o.express && <span className={styles.expressBadge}>{ui.express}</span>}
                      <span className={styles.orderTotal}>{o.total.toLocaleString()} KZT</span>
                    </div>
                  </div>
                  <div className={styles.orderBottom}>
                    <span className={styles.orderDetail}>{o.listType}</span>
                    <span className={styles.orderDetail}>{o.count}</span>
                    <span className={styles.orderDetail}>{new Date(o.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <a href={o.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
                      {ui.download_pdf}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN MANAGEMENT */}
        {tab === "admins" && (
          <div className={styles.section}>
            <h1 className={styles.sectionTitle}>{ui.admins_title}</h1>
            <div className={styles.addAdminCard}>
              <h3 className={styles.cardTitle}>{ui.add_admin_title}</h3>
              <div className={styles.addAdminRow}>
                <input
                  className={styles.searchInput}
                  placeholder={ui.email_placeholder}
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select
                  className={styles.roleSelect}
                  value={newAdminRole}
                  onChange={e => setNewAdminRole(e.target.value)}
                >
                  <option value="ADMIN">{ui.role_admin}</option>
                  <option value="OWNER">{ui.role_owner}</option>
                </select>
                <button className={styles.addBtn} onClick={handleAddAdmin} disabled={adminLoading} type="button">
                  {adminLoading ? ui.adding : ui.add}
                </button>
              </div>
              {adminMsg && (
                <p className={adminMsg.type === "success" ? styles.successMsg : styles.errorMsg}>
                  {adminMsg.text}
                </p>
              )}
            </div>
            <div className={styles.list}>
              {admins.map(a => (
                <div key={a.id} className={styles.adminRow}>
                  <div className={styles.patientInfo}>
                    <div className={styles.patientAvatar} style={{ background: a.role === "OWNER" ? "#1a5319" : "#2d7a2d" }}>
                      {(a.name?.[0] ?? a.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.patientName}>{a.name ?? ui.no_name}</p>
                      <p className={styles.patientEmail}>{a.email}</p>
                    </div>
                  </div>
                  <div className={styles.adminActions}>
                    <select className={styles.roleSelect} value={a.role} onChange={e => handleChangeRole(a.id, e.target.value)}>
                      <option value="ADMIN">{ui.role_admin}</option>
                      <option value="OWNER">{ui.role_owner}</option>
                    </select>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteAdmin(a.id)} type="button">
                      {ui.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WHATSAPP SETTINGS */}
        {tab === "whatsapp" && (
          <div className={styles.section}>
            <h1 className={styles.sectionTitle}>{ui.wa_title}</h1>
            <div className={styles.addAdminCard}>
              <h3 className={styles.cardTitle}>{ui.wa_card_title}</h3>
              <p className={styles.cardSub}>{ui.wa_card_sub}</p>
              <div className={styles.addAdminRow}>
                <input
                  className={styles.searchInput}
                  placeholder={ui.wa_placeholder}
                  value={waNumber}
                  onChange={e => setWaNumber(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  className={styles.addBtn}
                  onClick={async () => {
                    setWaSaving(true);
                    setWaMsg(null);
                    try {
                      const res = await fetch("/api/owner/whatsapp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ number: waNumber }),
                      });
                      if (!res.ok) throw new Error();
                      setWaMsg(ui.wa_saved);
                    } catch {
                      setWaMsg(ui.wa_failed);
                    } finally {
                      setWaSaving(false);
                    }
                  }}
                  disabled={waSaving}
                  type="button"
                >
                  {waSaving ? ui.wa_saving : ui.wa_save}
                </button>
              </div>
              {waMsg && <p className={styles.successMsg}>{waMsg}</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}