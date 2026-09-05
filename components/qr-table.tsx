"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge } from "./app-shell";
import { formatDate, statusLabel, type SampleQRCode } from "@/lib/data/sample-data";

type QRResponse = { data: SampleQRCode[]; total: number };

export function QRTable({ batchId }: { batchId?: string }) {
  const [codes, setCodes] = useState<SampleQRCode[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let active = true;
    async function loadCodes() {
      try {
        const response = await fetch("/api/sample/qr-codes");
        if (!response.ok) throw new Error("Unable to load sample QR codes");
        const result: QRResponse = await response.json();
        if (active) {
          setCodes(batchId ? result.data.filter((code) => code.batchId === batchId) : result.data);
          setState("ready");
        }
      } catch {
        if (active) setState("error");
      }
    }
    loadCodes();
    return () => {
      active = false;
    };
  }, [batchId]);

  if (state === "loading")
    return (
      <div className="card" style={{ padding: 32, color: "#71809a" }}>
        Loading sample QR inventory…
      </div>
    );
  if (state === "error")
    return (
      <div className="card" style={{ padding: 32, color: "#c33" }}>
        Could not load sample QR inventory. Please refresh and try again.
      </div>
    );
  const filteredCodes = codes.filter((code) => {
    const matchesSearch = code.qrId.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = status === "all" || code.status === status;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="card inventory-card">
      <div className="filter-row">
        <input
          className="input search"
          placeholder="Search by QR ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="select"
          style={{ maxWidth: 165 }}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="GENERATED">Generated</option>
          <option value="SENT_TO_PRINTING">Sent to printing</option>
          <option value="PRINTED">Printed</option>
          <option value="IN_STOCK">In stock</option>
          <option value="SOLD">Sold</option>
          <option value="ACTIVATED">Activated</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="DEACTIVATED">Deactivated</option>
        </select>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>QR ID</th>
              <th>Destination URL</th>
              <th>Status</th>
              <th>Created at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCodes.map((code) => (
              <tr key={code.id}>
                <td>
                  <strong>{code.qrId}</strong>
                </td>
                <td>{code.destinationUrl}</td>
                <td>
                  <StatusBadge status={statusLabel(code.status)} />
                </td>
                <td>{formatDate(code.createdAt)}</td>
                <td>
                  <Link href={`/q/${code.qrId}`} className="link-blue">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!filteredCodes.length && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#71809a" }}>
                  No QR codes match the current search and filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>
          Showing {filteredCodes.length} of {codes.length} sample codes
        </span>
        <span>Loaded from /api/sample/qr-codes</span>
      </div>
    </div>
  );
}
