/**
 * Optivue Growth OS lead-intake relay.
 *
 * Example runtime: Cloudflare Workers.
 * Keeps the private automation destination out of browser code.
 *
 * Required secret:
 *   MAKE_WEBHOOK_URL
 *
 * Optional:
 *   ALLOWED_ORIGIN
 */
export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, cors);
    }

    if (!env.MAKE_WEBHOOK_URL) {
      return json({ ok: false, error: 'Lead intake destination is not configured' }, 503, cors);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400, cors);
    }

    const validation = validate(payload);
    if (!validation.ok) {
      return json({ ok: false, error: validation.error }, 400, cors);
    }

    const upstream = await fetch(env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      return json({ ok: false, error: 'Intake service unavailable' }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};

function validate(payload) {
  if (!payload || payload.source !== 'optivue-growth-os') {
    return { ok: false, error: 'Invalid source' };
  }
  if (!payload.identity?.name || !payload.identity?.email) {
    return { ok: false, error: 'Name and email are required' };
  }
  if (!payload.consent?.contactConsent) {
    return { ok: false, error: 'Contact consent is required' };
  }
  return { ok: true };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
