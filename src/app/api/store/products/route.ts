import { NextResponse } from "next/server";
import { listProducts } from "@/lib/store";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
