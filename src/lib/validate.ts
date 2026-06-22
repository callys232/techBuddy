const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(v: string): string | null {
  if (!v.trim())              return "Email is required";
  if (!EMAIL_RE.test(v))      return "Please enter a valid email address";
  return null;
}

export function validateUrl(v: string): string | null {
  if (!v.trim())              return "URL is required";
  if (!/^https?:\/\/.+/.test(v)) return "URL must start with https://";
  try { new URL(v); return null; }
  catch                       { return "Please enter a valid URL (e.g. https://yoursite.com)"; }
}

export function validateName(v: string): string | null {
  if (!v.trim())              return "Name is required";
  if (v.trim().length < 2)   return "Name must be at least 2 characters";
  return null;
}
