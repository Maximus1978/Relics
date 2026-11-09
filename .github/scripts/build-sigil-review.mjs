import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'vite';

// Bundle the same showcase for opening directly from the evidence ZIP, without a local server.
export async function buildSigilReview(outputDirectory) {
  const result = await build({
    configFile: false,
    publicDir: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      write: false,
      lib: { entry: 'src/ui/sigils/preview.tsx', name: 'SigilReview', formats: ['iife'] },
    },
  });
  const outputs = Array.isArray(result) ? result.flatMap(item => item.output) : result.output;
  const script = outputs.find(item => item.type === 'chunk' && item.isEntry);
  const style = outputs.find(item => item.type === 'asset' && item.fileName.endsWith('.css'));
  if (!script || !style || outputs.length !== 2) throw new Error('Expected only bundled showcase JS and CSS.');
  const template = await readFile('sigils.html', 'utf8');
  const html = template
    .replace('</head>', () => '<style>' + String(style.source).replace(/<\/style/gi, '<\\/style') + '</style></head>')
    .replace('<script type="module" src="/src/ui/sigils/preview.tsx"></script>', () =>
      '<script>' + script.code.replace(/<\/script/gi, '<\\/script') + '</script>');
  const path = join(outputDirectory, 'sigils-review.html');
  await writeFile(path, html);
  return path;
}
