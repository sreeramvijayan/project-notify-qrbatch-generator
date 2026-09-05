import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowUpRight, Boxes, CircleCheck, PackagePlus, Printer, QrCode } from "lucide-react";
import { AppShell, IconTile, StatusBadge } from "@/components/app-shell";
const stats: [string, string, string, ComponentType<{ size?: number }>][] = [
  ["Total QR codes", "128,460", "12.5%", QrCode],
  ["Generated", "86,720", "8.2%", PackagePlus],
  ["In stock", "31,840", "4.6%", Boxes],
  ["Activated", "8,344", "15.8%", CircleCheck],
];
export default function Dashboard() {
  return (
    <AppShell>
      <div className="content">
        <div className="header-row">
          <div>
            <h1 className="page-title">Good morning, Sree</h1>
            <p className="page-subtitle">Here’s what’s happening across your QR inventory.</p>
          </div>
          <Link href="/batches/create" className="button button-primary">
            <PackagePlus /> Create QR batch
          </Link>
        </div>
        <section className="stat-grid">
          {stats.map(([label, value, trend, Icon]) => (
            <article className="card stat" key={label as string}>
              <div className="stat-top">
                <span>{label}</span>
                <IconTile>
                  <Icon size={17} />
                </IconTile>
              </div>
              <div className="stat-value">{value}</div>
              <div className="trend">
                ↑ {trend}
                <span>vs. last month</span>
              </div>
            </article>
          ))}
        </section>
        <section className="dashboard-grid">
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Recent batches</h2>
              <Link href="/batches" className="link-blue">
                View all
              </Link>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Batch name</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["VEHICLE-SEP-2026-BATCH-01", "Vehicle", "10,000", "Generated", "Today, 10:42"],
                    [
                      "WALLET-AUG-2026-BATCH-04",
                      "Wallet",
                      "5,000",
                      "Sent to printing",
                      "Aug 28, 2026",
                    ],
                    ["LUGGAGE-AUG-2026-BATCH-02", "Luggage", "2,500", "Printed", "Aug 21, 2026"],
                  ].map((r) => (
                    <tr key={r[0]}>
                      <td>
                        <strong>{r[0]}</strong>
                      </td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>
                        <StatusBadge status={r[3]} />
                      </td>
                      <td>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Inventory by status</h2>
              <ArrowUpRight size={16} color="#71809a" />
            </div>
            <div className="status-list">
              {[
                ["Generated", 86, 720, 68],
                ["Sent to printing", 12, 540, 10],
                ["Printed", 9, 180, 7],
                ["In stock", 31, 840, 25],
                ["Activated", 8, 344, 6],
              ].map(([label, count, width]) => (
                <div className="status-row" key={label as string}>
                  <span>{label}</span>
                  <div className="bar">
                    <i style={{ width: `${width}%` }} />
                  </div>
                  <strong>{Number(count).toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="card" style={{ marginTop: 22 }}>
          <div className="card-head">
            <h2 className="card-title">Activity</h2>
            <span className="link-blue">View audit log</span>
          </div>
          <div className="activity">
            {[
              "VEHICLE-SEP-2026-BATCH-01 generated with 10,000 QR codes",
              "WALLET-AUG-2026-BATCH-04 was sent to printing",
              "1,240 QR codes moved to In Stock",
            ].map((text, i) => (
              <div className="activity-item" key={text}>
                <div className="activity-dot">
                  <Printer size={14} />
                </div>
                <div>
                  <p>{text}</p>
                  <small>
                    {i === 0 ? "12 minutes ago" : i === 1 ? "2 hours ago" : "Yesterday"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
