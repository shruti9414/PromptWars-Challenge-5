// Bundles each Vercel Function entry (server/entries/*.ts) into a self-contained api/*.js.
// Vercel runs plain Node ESM, which cannot resolve the extensionless relative imports used in the TypeScript sources,
// so the functions are shipped pre-bundled. The generated api/*.js files are committed; rerun `npm run build:api` after
// changing anything under server/ or src/ai/.
import { stdout } from 'node:process'
import { build } from 'rolldown'

for (const name of ['plan', 'assistant', 'status']) {
  await build({
    input: `server/entries/${name}.ts`,
    platform: 'node',
    logLevel: 'warn',
    output: { file: `api/${name}.js`, format: 'esm', minify: false },
  })
  stdout.write(`api/${name}.js\n`)
}
