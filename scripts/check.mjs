import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { archive } from '../site/content/archive.js';

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0');
assert(!tracked.some(path => path.startsWith('subsense-original-content/')), 'Protected source corpus must remain untracked');
const ids = new Set(archive.entries.map(item => item.id));
assert.equal(ids.size, archive.entries.length, 'Entry IDs must be unique');
for (const item of archive.entries) {
  assert(item.title && item.orientation, `Missing entry text: ${item.id}`);
  for (const id of item.related) assert(ids.has(id), `Broken related entry: ${id}`);
}
for (const item of [...Object.values(archive.assets), ...archive.site.indexMedia]) {
  assert(item.sourcePath, `Missing provenance: ${item.publicPath}`);
  assert(item.publicPath.startsWith('assets/') && !item.publicPath.includes('..'));
  assert((await stat(`site/${item.publicPath}`)).isFile(), `Missing media: ${item.publicPath}`);
}
async function checkFiles(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${item.name}`;
    if (item.isDirectory()) { if (item.name !== 'assets') await checkFiles(path); continue; }
    if (path.endsWith('.js') || path.endsWith('.mjs')) execFileSync(process.execPath, ['--check', path]);
  }
}
await checkFiles('site');
await checkFiles('scripts');
const html = await readFile('site/index.html', 'utf8');
for (const [, path] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  assert(!path.startsWith('/'), `Root-relative URL breaks project hosting: ${path}`);
  if (!path.includes(':')) await stat(`site/${path}`);
}
console.log(`Checked JavaScript, ${ids.size} entries, public media, HTML references, and source exclusion.`);
