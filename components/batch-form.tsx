"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PrintingPackage } from "./printing-package";
import { QRPreview } from "./qr-preview";

const categories: Record<string, string[]> = {
  Vehicle: ["Vehicle registration tag", "Fleet asset label", "Service & warranty tag"],
  Wallet: ["Wallet recovery tag", "Premium wallet tag"],
  Luggage: ["Luggage identification tag", "Travel bag tag"],
};
export function BatchForm() {
  const [type, setType] = useState("Vehicle"),
    [category, setCategory] = useState(categories.Vehicle[0]),
    [prefix, setPrefix] = useState("VHC"),
    [start, setStart] = useState("000001"),
    [quantity, setQuantity] = useState("1000"),
    [name, setName] = useState("VEHICLE-SEP-2026-BATCH-01"),
    [destination, setDestination] = useState("https://tagflow.app/q"),
    [expiryDate, setExpiryDate] = useState(""),
    [confirm, setConfirm] = useState(false),
    [success, setSuccess] = useState(false);
  const preview = useMemo(() => {
    const digits = Math.max(start.length, 1),
      n = Number(start) || 0,
      q = Math.max(Number(quantity) || 0, 0),
      first = `${prefix || "QR"}-${String(n).padStart(digits, "0")}`,
      last = `${prefix || "QR"}-${String(n + Math.max(q - 1, 0)).padStart(digits, "0")}`;
    return { digits, first, last, url: `${destination.replace(/\/$/, "")}/${first}` };
  }, [prefix, start, quantity, destination]);
  const valid = Boolean(
    name &&
    prefix &&
    Number(start) >= 0 &&
    Number(quantity) > 0 &&
    Number(quantity) <= 100000 &&
    /^https?:\/\//.test(destination),
  );
  if (success)
    return (
      <div className="card form-card" style={{ textAlign: "center", padding: "54px 25px" }}>
        <CheckCircle2 size={48} color="#18a36d" />
        <h2 className="page-title" style={{ marginTop: 16 }}>
          QR Batch Created Successfully
        </h2>
        <p className="page-subtitle">
          {name} · {Number(quantity).toLocaleString()} codes · {preview.first} → {preview.last}
        </p>
        <div className="form-actions" style={{ justifyContent: "center" }}>
          <Link
            href={`/batches/batch-vehicle-sep-2026-01${expiryDate ? `?expiryDate=${encodeURIComponent(expiryDate)}` : ""}`}
            className="button button-primary"
          >
            Open batch <ArrowRight />
          </Link>
          <PrintingPackage
            batchName={name}
            prefix={prefix}
            startingNumber={start}
            quantity={Number(quantity)}
            destinationUrl={destination}
            expiryDate={expiryDate || undefined}
          />
        </div>
      </div>
    );
  return (
    <>
      <div className="create-grid">
        <form
          className="card form-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) setConfirm(true);
          }}
        >
          <section className="form-section">
            <h2 className="section-title">Batch information</h2>
            <p className="section-copy">
              Add the details used to organize and identify this print run.
            </p>
            <div className="fields">
              <Field
                label="Batch name"
                value={name}
                set={setName}
                placeholder="VEHICLE-SEP-2026-BATCH-01"
              />
              <Select
                label="Product type"
                value={type}
                set={(v) => {
                  setType(v);
                  setCategory(categories[v][0]);
                  setPrefix(v === "Vehicle" ? "VHC" : v === "Wallet" ? "WLT" : "LUG");
                }}
                options={Object.keys(categories)}
              />
              <Select
                label="QR product / category"
                value={category}
                set={setCategory}
                options={categories[type]}
              />
              <Field
                label="Quantity"
                value={quantity}
                set={setQuantity}
                type="number"
                hint="Maximum 100,000 codes per batch."
              />
            </div>
          </section>
          <section className="form-section">
            <h2 className="section-title">QR identification</h2>
            <p className="section-copy">IDs are permanent once generated and cannot be changed.</p>
            <div className="fields">
              <Field
                label="QR ID prefix"
                value={prefix}
                set={(v) => setPrefix(v.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                hint="Letters and numbers only."
              />
              <Field
                label="Starting number"
                value={start}
                set={(v) => setStart(v.replace(/\D/g, ""))}
                hint="Leading zeroes are preserved."
              />
              <Field
                label="Destination URL"
                value={destination}
                set={setDestination}
                hint="The QR ID will be appended automatically."
              />
              <Field
                label="Expiry date"
                value={expiryDate}
                set={setExpiryDate}
                type="date"
                optional
                hint="Leave empty if these QR codes do not expire."
              />
            </div>
          </section>
          <section className="form-section">
            <h2 className="section-title">Additional details</h2>
            <div className="fields one">
              <div className="field">
                <label>
                  Batch notes <span style={{ color: "#8a97aa", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  className="textarea"
                  placeholder="Add production notes, printer instructions, or references..."
                />
              </div>
            </div>
          </section>
          <div className="form-actions">
            <Link className="button button-ghost" href="/batches">
              Cancel
            </Link>
            <button
              className="button button-primary"
              disabled={!valid}
              style={!valid ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
              Generate QR codes <ArrowRight />
            </button>
          </div>
        </form>
        <aside className="preview-stack">
          <div className="card preview-card">
            <h3>Live QR preview</h3>
            <p>Preview updates as you enter batch details.</p>
            <div className="preview-qr">
              <QRPreview value={preview.url} />
            </div>
            <div className="preview-id">{preview.first}</div>
            <div className="preview-url">{preview.url}</div>
            <hr className="divider" />
            <div className="preview-row">
              <span>First QR ID</span>
              <strong>{preview.first}</strong>
            </div>
            <div className="preview-row">
              <span>Last QR ID</span>
              <strong>{preview.last}</strong>
            </div>
            <div className="preview-row">
              <span>Digit length</span>
              <strong>{preview.digits} digits</strong>
            </div>
            <div className="preview-row">
              <span>ID range</span>
              <strong>{Number(quantity || 0).toLocaleString()} codes</strong>
            </div>
          </div>
          <div className="card preview-card summary">
            <h3>Batch summary</h3>
            {[
              ["Batch", name],
              ["Product", type],
              ["Category", category],
              ["Quantity", Number(quantity || 0).toLocaleString()],
              ["Format", `${prefix}-${"0".repeat(preview.digits)}`],
              ["Destination", destination],
              ...(expiryDate ? [["Expiry", expiryDate]] : []),
            ].map(([k, v]) => (
              <div className="preview-row" key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
            <div className="notice">
              <AlertTriangle size={16} />
              QR IDs are immutable after generation. Confirm the range before submitting to the
              printing press.
            </div>
          </div>
        </aside>
      </div>
      {confirm && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <AlertTriangle size={28} color="#cc7a11" />
            <h2>Generate {Number(quantity).toLocaleString()} QR codes?</h2>
            <p>
              QR IDs are immutable after generation and should not be edited. The entire range will
              be reserved in inventory before your print package is created.
            </p>
            <div className="dialog-actions">
              <button className="button button-secondary" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  setConfirm(false);
                  setSuccess(true);
                }}
              >
                <Sparkles /> Generate QR codes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Field({
  label,
  value,
  set,
  type = "text",
  hint,
  optional,
  placeholder,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  type?: string;
  hint?: string;
  optional?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <label>
        {label} {!optional && <em>*</em>}
      </label>
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
      />
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
function Select({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="field">
      <label>
        {label} <em>*</em>
      </label>
      <select className="select" value={value} onChange={(e) => set(e.target.value)}>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}
