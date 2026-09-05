/** Temporary local data source. Replace these exports with Prisma queries when DATABASE_URL is connected. */
export type QRStatus =
  | "GENERATED"
  | "SENT_TO_PRINTING"
  | "PRINTED"
  | "IN_STOCK"
  | "SOLD"
  | "ACTIVATED"
  | "SUSPENDED"
  | "DEACTIVATED";
export type BatchStatus = "GENERATED" | "SENT_TO_PRINTING" | "PRINTED" | "COMPLETED";
export type SampleBatch = {
  id: string;
  batchName: string;
  productType: string;
  category: string;
  quantity: number;
  prefix: string;
  startingNumber: string;
  digitLength: number;
  destinationUrl: string;
  expiryDate: string | null;
  notes: string | null;
  status: BatchStatus;
  createdAt: string;
};
export type SampleQRCode = {
  id: string;
  batchId: string;
  qrId: string;
  destinationUrl: string;
  status: QRStatus;
  createdAt: string;
  printedAt: string | null;
  soldAt: string | null;
  activatedAt: string | null;
  suspendedAt: string | null;
};
export const productTypes = [
  {
    id: "vehicle",
    name: "Vehicle",
    categories: ["Vehicle registration tag", "Fleet asset label", "Service & warranty tag"],
  },
  { id: "wallet", name: "Wallet", categories: ["Wallet recovery tag", "Premium wallet tag"] },
  { id: "luggage", name: "Luggage", categories: ["Luggage identification tag", "Travel bag tag"] },
] as const;
export const sampleBatches: SampleBatch[] = [
  {
    id: "batch-vehicle-sep-2026-01",
    batchName: "VEHICLE-SEP-2026-BATCH-01",
    productType: "Vehicle",
    category: "Vehicle registration tag",
    quantity: 10000,
    prefix: "VHC",
    startingNumber: "000001",
    digitLength: 6,
    destinationUrl: "https://tagflow.app/q",
    expiryDate: null,
    notes: "Priority print run for dealer partners.",
    status: "GENERATED",
    createdAt: "2026-09-03T10:42:00Z",
  },
  {
    id: "batch-wallet-aug-2026-04",
    batchName: "WALLET-AUG-2026-BATCH-04",
    productType: "Wallet",
    category: "Wallet recovery tag",
    quantity: 5000,
    prefix: "WLT",
    startingNumber: "020001",
    digitLength: 6,
    destinationUrl: "https://tagflow.app/q",
    expiryDate: null,
    notes: null,
    status: "SENT_TO_PRINTING",
    createdAt: "2026-08-28T09:15:00Z",
  },
  {
    id: "batch-luggage-aug-2026-02",
    batchName: "LUGGAGE-AUG-2026-BATCH-02",
    productType: "Luggage",
    category: "Luggage identification tag",
    quantity: 2500,
    prefix: "LUG",
    startingNumber: "007501",
    digitLength: 6,
    destinationUrl: "https://tagflow.app/q",
    expiryDate: "2028-08-21T00:00:00Z",
    notes: "Airport retail inventory.",
    status: "PRINTED",
    createdAt: "2026-08-21T14:00:00Z",
  },
];
export const sampleQRCodes: SampleQRCode[] = [
  {
    id: "qr-1",
    batchId: "batch-vehicle-sep-2026-01",
    qrId: "VHC-000001",
    destinationUrl: "https://tagflow.app/q/VHC-000001",
    status: "GENERATED",
    createdAt: "2026-09-03T10:42:00Z",
    printedAt: null,
    soldAt: null,
    activatedAt: null,
    suspendedAt: null,
  },
  {
    id: "qr-2",
    batchId: "batch-vehicle-sep-2026-01",
    qrId: "VHC-000002",
    destinationUrl: "https://tagflow.app/q/VHC-000002",
    status: "GENERATED",
    createdAt: "2026-09-03T10:42:00Z",
    printedAt: null,
    soldAt: null,
    activatedAt: null,
    suspendedAt: null,
  },
  {
    id: "qr-3",
    batchId: "batch-wallet-aug-2026-04",
    qrId: "WLT-020543",
    destinationUrl: "https://tagflow.app/q/WLT-020543",
    status: "SENT_TO_PRINTING",
    createdAt: "2026-08-28T09:15:00Z",
    printedAt: null,
    soldAt: null,
    activatedAt: null,
    suspendedAt: null,
  },
  {
    id: "qr-4",
    batchId: "batch-luggage-aug-2026-02",
    qrId: "LUG-009881",
    destinationUrl: "https://tagflow.app/q/LUG-009881",
    status: "IN_STOCK",
    createdAt: "2026-08-21T14:00:00Z",
    printedAt: "2026-08-25T11:30:00Z",
    soldAt: null,
    activatedAt: null,
    suspendedAt: null,
  },
  {
    id: "qr-5",
    batchId: "batch-luggage-aug-2026-02",
    qrId: "LUG-009882",
    destinationUrl: "https://tagflow.app/q/LUG-009882",
    status: "ACTIVATED",
    createdAt: "2026-08-21T14:00:00Z",
    printedAt: "2026-08-25T11:30:00Z",
    soldAt: "2026-08-29T09:00:00Z",
    activatedAt: "2026-08-29T09:20:00Z",
    suspendedAt: null,
  },
];
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(
    new Date(value),
  );
export const statusLabel = (status: QRStatus | BatchStatus) =>
  status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
export const getBatch = (id: string) => sampleBatches.find((batch) => batch.id === id);
export const getBatchRange = (batch: SampleBatch) => {
  const first = `${batch.prefix}-${batch.startingNumber}`;
  const last = Number(batch.startingNumber) + batch.quantity - 1;
  return `${first} → ${batch.prefix}-${String(last).padStart(batch.digitLength, "0")}`;
};
