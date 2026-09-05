import { Printer } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { PrintingPackage } from "@/components/printing-package";
import { QRTable } from "@/components/qr-table";
import { formatDate, getBatch, getBatchRange, statusLabel } from "@/lib/data/sample-data";

export default async function BatchDetails({
  params,
  searchParams,
}: PageProps<"/batches/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const batch = getBatch(id);
  if (!batch) notFound();
  const expiryDate: string | null =
    typeof query.expiryDate === "string" ? query.expiryDate : batch.expiryDate;
  return (
    <AppShell active="QR Batches" crumb="Batch details">
      <div className="content">
        <div className="header-row">
          <div>
            <p className="page-subtitle" style={{ marginBottom: 7 }}>
              {batch.productType} · {batch.category}
            </p>
            <h1 className="page-title">{batch.batchName}</h1>
            <p className="page-subtitle">Created {formatDate(batch.createdAt)}</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <PrintingPackage
              batchName={batch.batchName}
              prefix={batch.prefix}
              startingNumber={batch.startingNumber}
              quantity={batch.quantity}
              destinationUrl={batch.destinationUrl}
              expiryDate={expiryDate ?? undefined}
            />
            <button className="button button-primary">
              <Printer /> Send to printing
            </button>
          </div>
        </div>
        <div className="card form-card" style={{ marginBottom: 24 }}>
          <div className="fields">
            <Info label="Quantity" value={`${batch.quantity.toLocaleString()} QR codes`} />
            <Info label="QR range" value={getBatchRange(batch)} />
            <Info label="Destination URL" value={`${batch.destinationUrl}/[qr-id]`} />
            <Info
              label="Numbering"
              value={`${batch.digitLength} digits · ${batch.prefix}-${"0".repeat(batch.digitLength)}`}
            />
            <Info
              label="Current status"
              value={<StatusBadge status={statusLabel(batch.status)} />}
            />
            <Info
              label="Expiry date"
              value={expiryDate ? formatDate(expiryDate) : "No expiry"}
            />
          </div>
        </div>
        <h2 className="section-title" style={{ marginBottom: 12 }}>
          Batch inventory
        </h2>
        <QRTable batchId={batch.id} />
      </div>
    </AppShell>
  );
}
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      <strong>{value}</strong>
    </div>
  );
}
