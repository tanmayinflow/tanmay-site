// Workers Static Assets do not implement byte ranges. Scope this adapter to
// the supplied reviews so native players can seek without downloading it all.
export const videoPath = '/media/reviews/paulina-recenze-titulky.mp4';

// ASSETS can omit Content-Length. The release check compares these byte
// lengths with the exact five files shipped alongside the Worker.
export const videoSizes = new Map([
  [videoPath, 24064548],
  ['/media/reviews/olga-recenze-titulky.mp4', 15818805],
  ['/media/reviews/maria-recenze-titulky.mp4', 9176651],
  ['/media/reviews/barbora-recenze-titulky-en.mp4', 3907448],
  ['/media/reviews/vladka-recenze-titulky-en.mp4', 10831041],
]);
export const videoPaths = [...videoSizes.keys()];

function rangeFor(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value || '');
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
      start >= size || start > end || (!match[1] && Number(match[2]) === 0)) return false;
  return { start, end };
}

function sliceStream(body, start, end) {
  const reader = body.getReader();
  let offset = 0;
  return new ReadableStream({
    async pull(controller) {
      while (offset <= end) {
        const { done, value } = await reader.read();
        if (done) throw new Error('Review video ended before its declared length');
        const chunkStart = offset;
        offset += value.byteLength;
        if (offset <= start) continue;
        controller.enqueue(value.subarray(Math.max(0, start - chunkStart), end - chunkStart + 1));
        if (offset > end) {
          controller.close();
          await reader.cancel();
        }
        return;
      }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
}

export default {
  async fetch(request, env) {
    if (!videoPaths.includes(new URL(request.url).pathname) || !['GET', 'HEAD'].includes(request.method)) {
      return env.ASSETS.fetch(request);
    }
    const requestedRange = request.headers.get('Range');
    const validator = request.headers.get('If-Range');
    const upstream = new Request(request);
    upstream.headers.delete('Range');
    upstream.headers.delete('If-Range');
    const asset = await env.ASSETS.fetch(upstream);
    if (asset.status !== 200) return asset;
    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('X-Content-Type-Options', 'nosniff');
    const matches = !validator || (validator === headers.get('ETag') && !validator.startsWith('W/'));
    if (request.method !== 'GET' || !matches || !requestedRange) {
      return new Response(asset.body, { status: 200, headers });
    }
    const lengthHeader = headers.get('Content-Length');
    const size = lengthHeader !== null && /^\d+$/.test(lengthHeader) && Number.isSafeInteger(Number(lengthHeader))
      ? Number(lengthHeader) : videoSizes.get(new URL(request.url).pathname);
    const range = rangeFor(requestedRange, size);
    if (range === false) {
      await asset.body?.cancel();
      headers.set('Content-Range', `bytes */${size}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }
    if (!range) return new Response(asset.body, { status: 200, headers });
    const length = range.end - range.start + 1;
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
    headers.set('Content-Length', String(length));
    const slice = sliceStream(asset.body, range.start, range.end);
    // Workers sets wire Content-Length from this stream, not from a header on
    // a general ReadableStream. Native players use that length for seeking.
    if (typeof FixedLengthStream === 'function') {
      const fixed = new FixedLengthStream(length);
      // An upstream error aborts the output. Client cancellation is expected.
      void slice.pipeTo(fixed.writable).catch(() => {});
      return new Response(fixed.readable, { status: 206, headers });
    }
    return new Response(slice, { status: 206, headers });
  },
};
