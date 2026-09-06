"use client";
import { useCallback, useEffect, useState } from "react";
import { IconCheck, IconLoader2, IconTrash, IconX } from "@tabler/icons-react";
import { authFetch } from "@/lib/authFetch";

interface Request { id: string; email: string; reason: string | null; status: string; created_at: string }
export function AdminDeletionRequests() {
  const [requests,setRequests]=useState<Request[]|null>(null); const [error,setError]=useState<string|null>(null); const [busy,setBusy]=useState<string|null>(null);
  const load=useCallback(async()=>{const res=await authFetch("/api/admin/deletion-requests"); const json=await res.json(); if(!res.ok){setError(json.error);setRequests([]);return;} setRequests(json.requests);},[]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{load();},[load]);
  const decide=async(id:string,decision:"approved"|"rejected")=>{if(decision==="approved"&&!window.confirm("Approve and soft-delete this account? This action is restricted to administrators."))return; setBusy(id); const res=await authFetch("/api/admin/deletion-requests",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,decision})}); const json=await res.json(); if(!res.ok)setError(json.error); else await load(); setBusy(null);};
  return <div className="max-w-4xl mx-auto"><p className="eyebrow mb-3">Administrator</p><h1 className="font-heading font-bold text-3xl text-[var(--ink)] mb-2">Account deletion requests</h1><p className="text-sm text-[var(--ink-muted)] mb-8">Only emails listed in ADMIN_EMAILS can view or approve this queue.</p>{error&&<div className="card p-4 text-sm text-[var(--bad)] mb-4">{error}</div>}{requests===null?<IconLoader2 className="animate-spin"/>:requests.length===0?<div className="card p-8 text-sm text-[var(--ink-muted)]">No deletion requests.</div>:<div className="space-y-3">{requests.map(item=><div key={item.id} className="card p-5 flex items-center justify-between gap-4 flex-wrap"><div><p className="font-semibold text-[var(--ink)]">{item.email}</p><p className="text-xs text-[var(--ink-muted)]">{new Date(item.created_at).toLocaleString()} · {item.status}</p>{item.reason&&<p className="text-sm text-[var(--ink-muted)] mt-2">{item.reason}</p>}</div>{item.status==="pending"&&<div className="flex gap-2"><button disabled={busy===item.id} onClick={()=>decide(item.id,"rejected")} className="btn-secondary h-9 px-3 text-xs"><IconX size={14}/>Reject</button><button disabled={busy===item.id} onClick={()=>decide(item.id,"approved")} className="btn-primary h-9 px-3 text-xs"><IconCheck size={14}/>{busy===item.id?<IconLoader2 size={14} className="animate-spin"/>:<><IconTrash size={14}/>Approve deletion</>}</button></div>}</div>)}</div>}</div>;
}
