import { cp, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const client = resolve(dist, 'client');
const server = resolve(dist, 'server');

await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const entry of ['assets', 'index.html', 'favicon.svg', 'logo.jpg', 'og.png', '.nojekyll']) {
  await cp(resolve(dist, entry), resolve(client, entry), { recursive: true, force: true });
}

await writeFile(resolve(server, 'index.js'), `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};\n`);
