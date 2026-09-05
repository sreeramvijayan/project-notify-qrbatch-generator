"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { formatDate, getBatchRange, sampleBatches, statusLabel } from "@/lib/data/sample-data";
export default function Batches() {
  const [search, setSearch] = useState("");
  const [productType, setProductType] = useState("all");
  const [status, setStatus] = useState("all");
  const filteredBatches = sampleBatches.filter((batch) => {
    const matchesSearch = batch.batchName.toLowerCase().includes(search.trim().toLowerCase());
    const matchesProduct = productType === "all" || batch.productType === productType;
    const matchesStatus = status === "all" || batch.status === status;
    return matchesSearch && matchesProduct && matchesStatus;
  });
  return (
    <AppShell active="QR Batches" crumb="Batches">
      <div className="content">
        <div className="header-row">
          <div>
            <h1 className="page-title">QR batches</h1>
            <p className="page-subtitle">
              Manage every QR print run from generation through activation.
            </p>
          </div>
          <Link href="/batches/create" className="button button-primary">
            <Plus /> Create QR batch
          </Link>
        </div>
        <div className="card inventory-card">
          <div className="filter-row">
            <input
              className="input search"
              placeholder="Search batch name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="select"
              style={{ maxWidth: 180 }}
              value={productType}
              onChange={(event) => setProductType(event.target.value)}
            >
              <option value="all">All product types</option>
              {["Vehicle", "Wallet", "Luggage"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              className="select"
              style={{ maxWidth: 160 }}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="GENERATED">Generated</option>
              <option value="SENT_TO_PRINTING">Sent to printing</option>
              <option value="PRINTED">Printed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch name</th>
                  <th>Product type</th>
                  <th>Quantity</th>
                  <th>QR range</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr key={batch.id}>
                    <td>
                      <Link href={`/batches/${batch.id}`} className="link-blue">
                        {batch.batchName}
                      </Link>
                    </td>
                    <td>{batch.productType}</td>
                    <td>{batch.quantity.toLocaleString()}</td>
                    <td>{getBatchRange(batch)}</td>
                    <td>
                      <StatusBadge status={statusLabel(batch.status)} />
                    </td>
                    <td>{formatDate(batch.createdAt)}</td>
                  </tr>
                ))}
                {!filteredBatches.length && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#71809a" }}>
                      No batches match the current search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span>
              Showing {filteredBatches.length} of {sampleBatches.length} sample batches
            </span>
            <span>Sample data mode</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
