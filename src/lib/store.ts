import { createServerClient } from "@/lib/supabase/client";
import { spendPoints } from "@/lib/points";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: "download" | "unlock";
  price_points: number;
  category: string | null;
}

function normalize(email: string) {
  return email.toLowerCase().trim();
}

/** Active catalog — file_path and unlock_key are left off the public shape,
 *  they're only ever read server-side at purchase/download time. */
export async function listProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, description, type, price_points, category")
    .eq("active", true)
    .order("category", { ascending: true });
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data;
}

export async function hasPurchased(email: string, productId: string): Promise<boolean> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("purchases")
    .select("id")
    .eq("email", normalize(email))
    .eq("product_id", productId)
    .maybeSingle();
  return !!data;
}

/** True if this email owns an unlock-type product with the given unlock_key.
 *  Used as an OR-condition alongside subscription checks in premium routes,
 *  so a one-off points purchase works without a recurring subscription. */
export async function isUnlocked(email: string, unlockKey: string): Promise<boolean> {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("unlock_key", unlockKey)
    .eq("type", "unlock")
    .maybeSingle();
  if (!product) return false;
  return hasPurchased(email, product.id);
}

/** Spends points and records the purchase. Throws on insufficient balance or
 *  an already-owned product (the unique (email, product_id) index enforces
 *  the latter at the DB level too, as a race-safety backstop). */
export async function purchaseProduct(email: string, productSlug: string): Promise<{ balance: number; product: { id: string; name: string; type: string } }> {
  const normalized = normalize(email);
  const supabase = createServerClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, name, type, price_points")
    .eq("slug", productSlug)
    .eq("active", true)
    .maybeSingle();
  if (!product) throw new Error("Product not found");

  if (await hasPurchased(normalized, product.id)) {
    throw new Error("You already own this");
  }

  const balance = await spendPoints(normalized, product.price_points, `purchase:${productSlug}`);

  const { error } = await supabase.from("purchases").insert({
    email: normalized,
    product_id: product.id,
    price_paid_points: product.price_points,
  });
  if (error) throw new Error("Purchase could not be recorded — contact support with your points transaction");

  return { balance, product: { id: product.id, name: product.name, type: product.type } };
}

/** Generates a short-lived signed download URL — only after verifying the
 *  purchase exists. Never expose file_path or a public bucket URL directly. */
export async function getDownloadUrl(email: string, productSlug: string): Promise<string> {
  const normalized = normalize(email);
  const supabase = createServerClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, file_path, type")
    .eq("slug", productSlug)
    .eq("active", true)
    .maybeSingle();
  if (!product || product.type !== "download" || !product.file_path) {
    throw new Error("This product has no downloadable file");
  }
  if (!(await hasPurchased(normalized, product.id))) {
    throw new Error("You haven't purchased this product");
  }

  const { data, error } = await supabase.storage.from("products").createSignedUrl(product.file_path, 60 * 10);
  if (error || !data) throw new Error("Could not generate a download link");
  return data.signedUrl;
}

export interface OwnedProduct {
  purchaseId: string;
  purchasedAt: string;
  pricePaidPoints: number;
  slug: string;
  name: string;
  type: "download" | "unlock";
  category: string | null;
}

/** Two queries instead of a PostgREST embed — the hand-maintained Database
 *  type doesn't declare table relationships, so a nested select wouldn't
 *  type-check cleanly against it. */
export async function listPurchases(email: string): Promise<OwnedProduct[]> {
  const supabase = createServerClient();

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, created_at, price_paid_points, product_id")
    .eq("email", normalize(email))
    .order("created_at", { ascending: false });
  if (!purchases?.length) return [];

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, type, category")
    .in("id", purchases.map((p) => p.product_id));

  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  return purchases
    .map((p) => {
      const product = byId.get(p.product_id);
      if (!product) return null;
      return {
        purchaseId: p.id,
        purchasedAt: p.created_at,
        pricePaidPoints: p.price_paid_points,
        slug: product.slug,
        name: product.name,
        type: product.type,
        category: product.category,
      };
    })
    .filter((p): p is OwnedProduct => p !== null);
}
