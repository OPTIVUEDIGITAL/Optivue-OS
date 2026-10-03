// Apply hostname policy after the static asset response, including redirects/404s.
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    if (!url.hostname.endsWith('.workers.dev')) return response;
    const result = new Response(response.body, response);
    result.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return result;
  }
};
