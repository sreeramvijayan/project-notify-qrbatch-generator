import { NextResponse } from "next/server";
import { sampleBatches } from "@/lib/data/sample-data";

export async function GET() {
  return NextResponse.json({ data: sampleBatches, total: sampleBatches.length });
}
