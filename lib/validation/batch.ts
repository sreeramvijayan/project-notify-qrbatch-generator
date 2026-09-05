import { z } from "zod";
export const MAX_BATCH_QUANTITY = 100_000;
export const createBatchSchema = z.object({
  batchName: z.string().trim().min(3).max(120),
  productTypeId: z.string().min(1),
  categoryId: z.string().min(1),
  quantity: z.coerce.number().int().positive().max(MAX_BATCH_QUANTITY),
  prefix: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{2,12}$/),
  startingNumber: z.string().regex(/^\d{1,12}$/),
  destinationUrl: z.url(),
  expiryDate: z.coerce.date().optional(),
  notes: z.string().max(1000).optional(),
});
export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export function getQRRange(prefix: string, startingNumber: string, quantity: number) {
  const start = BigInt(startingNumber);
  const last = start + BigInt(quantity) - BigInt(1);
  const width = startingNumber.length;
  if (last.toString().length > width)
    throw new Error("QR ID range exceeds the selected digit length.");
  return Array.from(
    { length: quantity },
    (_, i) => `${prefix}-${(start + BigInt(i)).toString().padStart(width, "0")}`,
  );
}
