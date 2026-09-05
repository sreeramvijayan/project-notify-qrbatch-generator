import { NextResponse } from "next/server";
import { sampleQRCodes } from "@/lib/data/sample-data";

/** Local development API. Replace its data source when a real backend is introduced. */
export async function GET() {
  return NextResponse.json({ data: sampleQRCodes, total: sampleQRCodes.length });
}
