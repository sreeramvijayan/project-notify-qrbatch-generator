import Link from "next/link";
import { CircleCheckBig, CircleX, ExternalLink, QrCode } from "lucide-react";
import { notFound } from "next/navigation";
import { QRPreview } from "@/components/qr-preview";
import { sampleQRCodes, statusLabel } from "@/lib/data/sample-data";

export default async function PublicQRPage({ params }: PageProps<"/q/[qrId]">) {
  const { qrId } = await params;
  const code = sampleQRCodes.find((item) => item.qrId === qrId);
  if (!code) notFound();
  const unavailable = code.status === "DEACTIVATED";
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "#f7f9fc",
      }}
    >
      <section
        className="card"
        style={{ width: "100%", maxWidth: 460, padding: 32, textAlign: "center" }}
      >
        <div className="brand-mark" style={{ margin: "0 auto 20px", color: "white" }}>
          <QrCode size={17} />
        </div>
        {unavailable ? (
          <CircleX size={44} color="#d0525d" />
        ) : (
          <CircleCheckBig size={44} color="#18a36d" />
        )}
        <h1 className="page-title" style={{ marginTop: 14 }}>
          {unavailable ? "This QR code is unavailable" : "QR code verified"}
        </h1>
        <p className="page-subtitle">
          {unavailable
            ? "This tag has been deactivated."
            : "This physical tag is active and recognized by Tagflow."}
        </p>
        <div className="preview-qr" style={{ marginTop: 24 }}>
          <QRPreview value={code.destinationUrl} />
        </div>
        <div className="preview-id" style={{ marginTop: 12 }}>
          {code.qrId}
        </div>
        <p className="preview-url">{code.destinationUrl}</p>
        <hr className="divider" />
        <div className="preview-row">
          <span>Status</span>
          <strong>{statusLabel(code.status)}</strong>
        </div>
        <div className="preview-row">
          <span>Tag destination</span>
          <strong>{code.destinationUrl}</strong>
        </div>
        {!unavailable && (
          <a
            className="button button-primary"
            style={{ marginTop: 18 }}
            href={code.destinationUrl}
            target="_blank"
            rel="noreferrer"
          >
            Continue to destination <ExternalLink />
          </a>
        )}
        <div style={{ marginTop: 18 }}>
          <Link href="/dashboard" className="link-blue">
            Back to QR operations
          </Link>
        </div>
      </section>
    </main>
  );
}
