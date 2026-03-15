// src/lib/config.ts

/**
 * Runtime configuration.
 *
 * IMPORTANT (Next.js): `NEXT_PUBLIC_*` variables are embedded at build time.
 */

export function getApiBaseUrl(): string {
  // Prefer the new variable name, keep backward compatibility.
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!url) {
    // No localhost fallback on purpose (breaks production on Vercel).
    throw new Error(
      'Missing NEXT_PUBLIC_API_URL. Set it in Vercel Environment Variables to your deployed backend URL (e.g. https://zarl1-phase2-backend.hf.space).'
    );
  }

  return url.replace(/\/$/, '');
}

