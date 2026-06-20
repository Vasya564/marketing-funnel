/**
 * End-to-end smoke test against a running dev server.
 * Usage: npm run dev (in one terminal), then `npm run smoke`.
 */
import { FunnelEvent } from '../src/lib/events';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

class CookieJar {
  private jar = new Map<string, string>();

  capture(response: Response): void {
    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(';');
      const separator = pair.indexOf('=');
      this.jar.set(pair.slice(0, separator), pair.slice(separator + 1));
    }
  }

  header(): string {
    return Array.from(this.jar.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}

async function post(
  jar: CookieJar,
  path: string,
  body: Record<string, unknown>,
): Promise<Response> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: jar.header() },
    body: JSON.stringify(body),
  });

  jar.capture(response);
  return response;
}

async function runFunnel(
  jar: CookieJar,
  email: string,
  utmSource: string,
): Promise<{ returning: boolean }> {
  await post(jar, '/api/track', {
    type: FunnelEvent.QuizStarted,
    utmSource,
  });

  const emailResponse = await post(jar, '/api/funnel/email', { email });
  const { returning } = (await emailResponse.json()) as { returning: boolean };

  await post(jar, '/api/track', { type: FunnelEvent.PaywallVisited });
  await post(jar, '/api/track', { type: FunnelEvent.PurchaseClicked });

  return { returning };
}

async function main() {
  const email = `smoke+${Date.now()}@example.com`;
  const jar = new CookieJar();

  const first = await runFunnel(jar, email, 'google');
  console.log(`Visit 1 (google) returning=${first.returning} (expected false)`);

  const second = await runFunnel(jar, email, 'facebook');
  console.log(`Visit 2 (facebook) returning=${second.returning} (expected true)`);

  console.log('\nNow open the dashboard:');
  console.log(`  ${BASE_URL}/dashboard`);
  console.log('Expect: first-touch=google, last-touch=facebook for this user.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
