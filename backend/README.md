# Optional Backend Boundary

The portable Optivue Growth OS must remain functional without Node.js or a server runtime.

Use this directory only for features that genuinely require server-side execution, such as:

- protected CRM API calls
- Make/webhook signing
- persistence of audit submissions
- proposal-generation APIs
- database access
- secret-bearing integrations

Recommended rule: browser code calls a documented HTTPS endpoint; secrets never ship inside the portable embed.

Potential runtimes later: Wix Velo, Node.js serverless functions, Supabase Edge Functions, Netlify Functions, Vercel Functions, or another compatible API host.
