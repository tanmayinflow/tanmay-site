// Workers Static Assets do not implement byte ranges. Scope this adapter to
// the supplied review so native players can seek without downloading it all.
export const videoPath = '/media/reviews/paulina-recenze-titulky.mp4';

function rangeFor(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value || '');
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
      start >= size || start > end || (!match[1] && Number(match[2]) === 0)) return false;
  return { start, end };
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== videoPath || !['GET', 'HEAD'].includes(request.method)) {
      return env.ASSETS.fetch(request);
    }
    const upstream = new Request(request);
    upstream.headers.delete('Range');
    upstream.headers.delete('If-Range');
    const asset = await env.ASSETS.fetch(upstream);
    if (asset.status !== 200) return asset;
    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    const size = Number(headers.get('Content-Length'));
    const validator = request.headers.get('If-Range');
    const matches = !validator || (validator === headers.get('ETag') && !validator.startsWith('W/'));
    const range = request.method === 'GET' && matches && Number.isSafeInteger(size) && size > 0
      ? rangeFor(request.headers.get('Range'), size) : null;
    if (range === false) {
      await asset.body?.cancel();
      headers.set('Content-Range', `bytes */${size}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }
    if (!range) return new Response(asset.body, { status: 200, headers });
    // This one fixed asset is under 25 MiB. An ArrayBuffer response gives the
    // runtime an exact Content-Length, required by Safari's native player.
    const bytes = await asset.arrayBuffer();
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
    headers.set('Content-Length', String(range.end - range.start + 1));
    return new Response(bytes.slice(range.start, range.end + 1), { status: 206, headers });
  },
};
