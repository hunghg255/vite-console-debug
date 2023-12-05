import { promises as fs } from 'fs';
import fg from 'fast-glob';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, resolve } from 'pathe';
import { copy } from 'fs-extra';

async function run() {
  // fix cjs exports
  const files = await fg('*.js', {
    ignore: ['index.js', 'chunk-*'],
    absolute: true,
    cwd: resolve(__dirname, '../dist'),
  });
  for (const file of files) {
    console.log('[postbuild]', basename(file));
    // eslint-disable-next-line no-await-in-loop
    let code = await fs.readFile(file, 'utf8');
    code = code.replace('exports.default =', 'module.exports =');
    code += 'exports.default = module.exports;';
    // eslint-disable-next-line no-await-in-loop
    await fs.writeFile(file, code);
  }

  const source = join(dirname(fileURLToPath(import.meta.url)), '../src/client');
  const target = join(
    dirname(fileURLToPath(import.meta.url)),
    '../dist/client',
  );

  copy(source, target);
}

run();
