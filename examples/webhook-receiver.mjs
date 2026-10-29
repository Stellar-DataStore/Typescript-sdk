// A minimal webhook receiver using only node:http and the SDK. Run from the repo root after `npm run build`:
//
//   STELLARDS_WEBHOOK_SECRET=whsec_... node examples/webhook-receiver.mjs
//
// then point a StellarDS webhook at http://<public host>:3000/stellards (for example through a tunnel).
// With Express, use express.raw({ type: 'application/json' }) on the route so you get the raw body: the signature is
// computed over the exact bytes, so verify before parsing and never re-serialize the JSON.
import { createServer } from 'node:http';
import { EVENT_ID_HEADER, SIGNATURE_HEADER, constructWebhookEvent } from '../dist/index.js';

const secret = process.env.STELLARDS_WEBHOOK_SECRET;
// During a secret rotation, also accept the previous secret until it expires.
const previousSecret = process.env.STELLARDS_WEBHOOK_PREVIOUS_SECRET;
if (!secret) {
  console.error('Set STELLARDS_WEBHOOK_SECRET to the whsec_... secret shown when the webhook was created.');
  process.exit(1);
}

// Deliveries can repeat: remember recent event ids (use a database or cache in production).
const seen = new Set();

const server = createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/stellards') {
    res.writeHead(404).end();
    return;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const payload = new Uint8Array(Buffer.concat(chunks));

  let event;
  try {
    event = await constructWebhookEvent({
      payload,
      header: req.headers[SIGNATURE_HEADER.toLowerCase()],
      secret: previousSecret ? [secret, previousSecret] : secret,
    });
  } catch {
    res.writeHead(401).end('invalid signature');
    return;
  }

  const eventId = req.headers[EVENT_ID_HEADER.toLowerCase()] ?? event.id;
  if (seen.has(eventId)) {
    res.writeHead(200).end('duplicate');
    return;
  }
  seen.add(eventId);

  // Answer quickly (2xx); do slow work after responding or in a queue.
  res.writeHead(200).end('ok');
  console.log(`${event.type} on ${event.table?.name ?? '-'}`, event.data.record ?? event.data.field ?? '');
});

server.listen(Number(process.env.PORT ?? 3000), () => {
  console.log(`Listening on http://localhost:${server.address().port}/stellards`);
});
