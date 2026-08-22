import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GithubRepoResponse {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  license: { spdx_id: string; name: string } | null;
  fork: boolean;
  archived: boolean;
}

function parseRepoPath(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  const match = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const url = body?.url as string | undefined;
  if (!url) return NextResponse.json({ error: "A GitHub repo URL is required." }, { status: 400 });

  const parsed = parseRepoPath(url);
  if (!parsed) return NextResponse.json({ error: "That doesn't look like a github.com/owner/repo URL." }, { status: 400 });

  const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "techbuddy-repo-health-scan",
      ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: 3600 },
  });

  if (res.status === 404) return NextResponse.json({ error: "Repo not found — check the URL and that it's public." }, { status: 404 });
  if (res.status === 403) return NextResponse.json({ error: "GitHub rate limit reached — try again in a few minutes." }, { status: 429 });
  if (!res.ok) return NextResponse.json({ error: "Couldn't reach GitHub right now." }, { status: 502 });

  const repo: GithubRepoResponse = await res.json();

  const pushDays = daysSince(repo.pushed_at);
  const recencyScore = Math.round(Math.max(0, 40 - (pushDays / 730) * 40));

  const hasLicense = !!repo.license;
  const licenseScore = hasLicense ? 20 : 0;

  const issueRatio = repo.open_issues_count / Math.max(repo.stargazers_count, 1);
  const issueScore = repo.open_issues_count === 0 ? 25 : Math.round(Math.max(0, 25 - Math.min(issueRatio, 1) * 25));

  const hasDescription = !!repo.description && repo.description.trim().length > 0;
  const descScore = hasDescription ? 15 : 0;

  const score = recencyScore + licenseScore + issueScore + descScore;

  const flags = [
    { ok: pushDays < 90, label: pushDays < 90 ? `Active — last push ${Math.round(pushDays)} days ago` : `Stale — last push ${Math.round(pushDays)} days ago` },
    { ok: hasLicense, label: hasLicense ? `Licensed (${repo.license!.spdx_id})` : "No license file — unclear if it's legal to reuse" },
    { ok: repo.open_issues_count < repo.stargazers_count * 0.3 || repo.open_issues_count < 10, label: `${repo.open_issues_count} open issues${repo.stargazers_count > 0 ? ` (${repo.stargazers_count} stars)` : ""}` },
    { ok: hasDescription, label: hasDescription ? "Has a repo description" : "No repo description" },
    { ok: !repo.archived, label: repo.archived ? "Archived — no longer maintained" : "Not archived" },
  ];

  return NextResponse.json({
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    pushedAt: repo.pushed_at,
    license: repo.license?.spdx_id ?? null,
    score,
    flags,
  });
}
