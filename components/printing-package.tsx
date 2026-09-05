"use client";

import JSZip from "jszip";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { useState } from "react";

type PrintingPackageProps = {
  batchName: string;
  prefix: string;
  startingNumber: string;
  quantity: number;
  destinationUrl: string;
  expiryDate?: string;
};
type CardInput = { qrId: string; url: string; svg: string; expiryDate?: string };

const cardStyles = `@page{size:90mm 120mm;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#18233b}.card{width:90mm;min-height:120mm;padding:11mm 8mm;border:1px solid #e2e8f0;border-radius:4mm;text-align:center;page-break-after:always}h1{margin:0;font-size:15pt;text-align:left}.intro{margin:2mm 0 8mm;color:#71809a;font-size:9pt;text-align:left}.qr{width:48mm;height:48mm;margin:0 auto 5mm;padding:3mm;border:1px solid #e2e8f0;border-radius:3mm}.qr svg{width:100%;height:100%}.id{font-size:14pt;font-weight:700}.url{color:#617799;font-size:8pt;overflow-wrap:anywhere;margin:3mm 0 7mm}hr{border:0;border-top:1px solid #e2e8f0}.row{display:flex;justify-content:space-between;gap:5mm;padding:3mm 0;color:#71809a;font-size:9pt;text-align:left}.row strong{color:#34435d;text-align:right}@media print{.card{border:0;border-radius:0}}`;
function cardBody({ qrId, url, svg, expiryDate }: CardInput) {
  const expiryRow = expiryDate
    ? `<div class="row"><span>Expires</span><strong>${expiryDate}</strong></div>`
    : "";
  return `<main class="card"><h1>Live QR preview</h1><p class="intro">Print-ready QR identification card</p><div class="qr">${svg}</div><div class="id">${qrId}</div><div class="url">${url}</div><hr><div class="row"><span>QR ID</span><strong>${qrId}</strong></div><div class="row"><span>Destination</span><strong>${url}</strong></div>${expiryRow}</main>`;
}
function cardDocument(input: CardInput) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${input.qrId}</title><style>${cardStyles}</style></head><body>${cardBody(input)}</body></html>`;
}

export function PrintingPackage({
  batchName,
  prefix,
  startingNumber,
  quantity,
  destinationUrl,
  expiryDate,
}: PrintingPackageProps) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  async function downloadPackage() {
    if (quantity > 10000) {
      setState("error");
      setMessage("For this browser-only sample, use 10,000 codes or fewer per ZIP.");
      return;
    }
    setState("working");
    setMessage("Generating QR artwork and print cards…");
    try {
      const zip = new JSZip(),
        qrFolder = zip.folder("qr"),
        cardFolder = zip.folder("print-cards");
      const digitLength = startingNumber.length,
        start = Number(startingNumber),
        base = destinationUrl.replace(/\/$/, ""),
        csv = ["qr_id,destination_url,status,expiry_date"],
        cards: string[] = [];
      for (let index = 0; index < quantity; index += 1) {
        const qrId = `${prefix}-${String(start + index).padStart(digitLength, "0")}`,
          url = `${base}/${qrId}`;
        const svg = await QRCode.toString(url, {
          type: "svg",
          margin: 1,
          errorCorrectionLevel: "M",
        });
        const card = { qrId, url, svg, expiryDate };
        qrFolder?.file(`${qrId}.svg`, svg);
        cardFolder?.file(`${qrId}.html`, cardDocument(card));
        cards.push(cardBody(card));
        csv.push(`${qrId},${url},GENERATED,${expiryDate ?? ""}`);
      }
      zip.file("mapping.csv", csv.join("\n"));
      zip.file(
        "print-cards.html",
        `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${batchName} print cards</title><style>${cardStyles}</style></head><body>${cards.join("")}</body></html>`,
      );
      zip.file(
        "batch-info.json",
        JSON.stringify(
          {
            batchName,
            prefix,
            startingNumber,
            quantity,
            destinationUrl: base,
            expiryDate: expiryDate ?? null,
            generatedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      const blob = await zip.generateAsync({ type: "blob" }),
        href = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = href;
      link.download = `${batchName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-printing-package.zip`;
      link.click();
      URL.revokeObjectURL(href);
      setState("done");
      setMessage("Package downloaded. Open print-cards.html and use Print → Save as PDF.");
    } catch {
      setState("error");
      setMessage("Could not generate the printing package. Please try again.");
    }
  }
  return (
    <div>
      <button
        className="button button-secondary"
        onClick={downloadPackage}
        disabled={state === "working"}
      >
        {state === "working" ? (
          "Generating package…"
        ) : (
          <>
            <Download /> Download printing package
          </>
        )}
      </button>
      {message && (
        <p
          className="hint"
          style={{ marginTop: 10, color: state === "error" ? "#c33" : undefined }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
