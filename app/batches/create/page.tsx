import { AppShell } from "@/components/app-shell";
import { BatchForm } from "@/components/batch-form";
export default function CreateBatch() {
  return (
    <AppShell active="QR Batches" crumb="Create batch">
      <div className="content">
        <div className="header-row">
          <div>
            <h1 className="page-title">Create QR batch</h1>
            <p className="page-subtitle">
              Generate a secure, print-ready collection of unique QR codes.
            </p>
          </div>
        </div>
        <BatchForm />
      </div>
    </AppShell>
  );
}
