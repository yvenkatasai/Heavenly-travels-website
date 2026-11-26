import fs from 'node:fs/promises';
import path from 'node:path';
import tls from 'node:tls';

const domain = 'heavenlytoursandtravels.com';
const output = path.resolve('artifacts/deployment/launch-review-2026-11-23');
await fs.mkdir(output, { recursive: true });
async function capture(name, url, options = {}) {
  try {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(45000) });
    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    const result = {
      checkedAt: new Date().toISOString(),
      url,
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body,
    };
    await fs.writeFile(path.join(output, `${name}.json`), JSON.stringify(result, null, 2));
    console.log(
      `${name}: HTTP ${response.status}${body?.grade ? `; grade ${body.grade}` : ''}${body?.status ? `; state ${body.status}` : ''}`,
    );
    return result;
  } catch (error) {
    await fs.writeFile(
      path.join(output, `${name}.json`),
      JSON.stringify({ url, checkedAt: new Date().toISOString(), error: error.message }),
    );
    console.log(`${name}: ${error.message}`);
  }
}
await Promise.allSettled([
  capture('observatory', `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${domain}`, {
    method: 'POST',
  }),
  capture(
    'ssl-labs',
    `https://api.ssllabs.com/api/v3/analyze?host=${domain}&publish=off&startNew=on&all=done`,
  ),
  capture(
    'pagespeed-mobile',
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${domain}/&strategy=mobile&category=performance&category=accessibility&category=seo&category=best-practices`,
  ),
  capture(
    'security-headers',
    `https://securityheaders.com/?q=https%3A%2F%2F${domain}&followRedirects=on`,
  ),
  capture('certificate-transparency', `https://crt.sh/?q=${domain}&output=json`),
  capture('domain-rdap', `https://rdap.verisign.com/com/v1/domain/${domain}`),
  ...[
    ['CAA', domain],
    ['MX', domain],
    ['TXT', domain],
    ['TXT', `_dmarc.${domain}`],
    ['NS', domain],
  ].map(([type, name]) =>
    capture(
      `dns-${type}-${name.startsWith('_') ? 'dmarc' : 'apex'}`,
      `https://dns.google/resolve?name=${name}&type=${type}`,
    ),
  ),
  new Promise((resolve) => {
    const socket = tls.connect(
      { host: domain, port: 443, servername: domain, rejectUnauthorized: true },
      async () => {
        const certificate = socket.getPeerCertificate();
        await fs.writeFile(
          path.join(output, 'live-certificate.json'),
          JSON.stringify(
            {
              checkedAt: new Date().toISOString(),
              authorized: socket.authorized,
              protocol: socket.getProtocol(),
              subject: certificate.subject,
              issuer: certificate.issuer,
              validFrom: certificate.valid_from,
              validTo: certificate.valid_to,
              subjectAltName: certificate.subjectaltname,
              fingerprint256: certificate.fingerprint256,
            },
            null,
            2,
          ),
        );
        console.log(
          `live-certificate: ${socket.getProtocol()}, valid until ${certificate.valid_to}`,
        );
        socket.end();
        resolve();
      },
    );
    socket.setTimeout(20000, () => {
      socket.destroy();
      resolve();
    });
    socket.on('error', (error) => {
      console.log(`live-certificate: ${error.message}`);
      resolve();
    });
  }),
]);
