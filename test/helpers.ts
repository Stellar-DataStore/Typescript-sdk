import { StellarDS, type StellarDSOptions } from '../src/index.js';

export interface Call {
  method: string;
  url: URL;
  headers: Record<string, string>;
  body: unknown;
  rawBody: BodyInit | null | undefined;
  signal: AbortSignal | null | undefined;
}

type Responder = (call: Call) => Response | Promise<Response>;

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
}

export function ok<T>(data: T, extra: Record<string, unknown> = {}): Response {
  return json({ data, isSuccess: true, messages: [], ...extra });
}

/** A fetch mock that records calls and answers from a queue (the last responder answers everything after). */
export function mockFetch(...responders: Responder[]) {
  const calls: Call[] = [];
  const queue = [...responders];
  const fetch = async (input: string, init: RequestInit = {}): Promise<Response> => {
    const headers: Record<string, string> = {};
    new Headers(init.headers).forEach((v, k) => (headers[k] = v));
    let body: unknown = init.body;
    if (typeof init.body === 'string' && headers['content-type'] === 'application/json') body = JSON.parse(init.body);
    const call: Call = { method: init.method ?? 'GET', url: new URL(input), headers, body, rawBody: init.body, signal: init.signal };
    calls.push(call);
    const responder = queue.length > 1 ? queue.shift() : queue[0];
    if (!responder) throw new Error('no response queued');
    return responder(call);
  };
  return { fetch, calls };
}

export function client(fetch: StellarDSOptions['fetch'], options: StellarDSOptions = {}) {
  return new StellarDS({ accessToken: 'tok', project: 'p1', baseUrl: 'https://api.test', fetch, ...options });
}
