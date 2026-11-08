import { cp, lstat, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { archive } from '../site/content/archive.js';

// Explicit browser files, plus media selected in the public content manifest.
// Never copy site/ wholesale: it also contains internal authoring instructions.
const files = new Set([
  'index.html', 'app.js', 'styles.css', 'home.css', 'entries.css',
  'content/archive.js', 'interactions/apparatus.js', 'interactions/registration.js',
  ...archive.site.indexMedia.map(item => item.publicPath),
]);
const usedAssets = new Set();
function selectAsset(id) {
  if (usedAssets.has(id)) return;
  const asset = archive.assets[id];
  if (!asset) throw new Error(`Unknown asset: ${id}`);
  usedAssets.add(id);
  files.add(asset.publicPath);
  if (asset.poster) selectAsset(asset.poster);
}
function visit(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'asset' || key === 'cover') selectAsset(child);
    else if (key === 'assets') child.forEach(selectAsset);
    else visit(child);
  }
}
archive.entries.forEach(visit);

const tracked = new Set(execFileSync('git', ['ls-files', '-z', 'site/'], { encoding: 'utf8' }).split('\0'));
for (const file of files) {
  if (!/^[a-zA-Z0-9_./-]+$/.test(file) || file.split('/').some(part => part === '..' || part.startsWith('.')))
    throw new Error(`Unsafe public path: ${file}`);
  if (!tracked.has(`site/${file}`)) throw new Error(`Public file is not tracked: ${file}`);
  let path = 'site';
  for (const part of file.split('/')) {
    path += `/${part}`;
    if ((await lstat(path)).isSymbolicLink()) throw new Error(`Public symlink: ${path}`);
  }
  if (!(await lstat(path)).isFile()) throw new Error(`Not a file: ${path}`);
}
const output = resolve('dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of files) {
  await mkdir(resolve(output, file, '..'), { recursive: true });
  await cp(`site/${file}`, resolve(output, file));
}
await writeFile(resolve(output, '.nojekyll'), '');
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await writeFile(resolve(output, 'version.json'), JSON.stringify({ revision }) + '\n');
const bytes = (await Promise.all([...files].map(async file => (await lstat(`site/${file}`)).size))).reduce((a, b) => a + b, 0);
if (bytes > 500 * 1024 * 1024) throw new Error('Public package exceeds the 500 MiB project budget; review media delivery.');
console.log(`Packaged ${files.size} public files (${(bytes / 1024 / 1024).toFixed(1)} MiB), revision ${revision}.`);
