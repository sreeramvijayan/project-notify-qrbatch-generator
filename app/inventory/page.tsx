import { AppShell } from "@/components/app-shell";
import { QRTable } from "@/components/qr-table";
export default function Inventory() {
  return (
    <AppShell active="QR Inventory" crumb="Inventory">
      <div className="content">
        <div className="header-row">
          <div>
            <h1 className="page-title">QR inventory</h1>
            <p className="page-subtitle">
              Search and track the lifecycle of every physical QR tag.
            </p>
          </div>
        </div>
        <QRTable />
      </div>
    </AppShell>
  );
}
