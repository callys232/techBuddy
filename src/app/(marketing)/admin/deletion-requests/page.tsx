import type { Metadata } from "next";
import { AdminDeletionRequests } from "@/components/sections/AdminDeletionRequests";

export const metadata: Metadata = { title: "Deletion requests — Admin", robots: { index: false, follow: false } };
export default function Page() { return <main className="section-shell section-pad"><AdminDeletionRequests /></main>; }
