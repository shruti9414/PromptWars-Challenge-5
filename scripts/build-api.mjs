// Bundles each Vercel Function entry (server/entries/*.ts) into a small api/*.js.
// Vercel runs plain Node ESM, which cannot resolve the extensionless relative imports used in the TypeScript sources,
// so the functions are shipped pre-bundled. `zod` stays external (it is a regular dependency that Vercel installs).
// The generated api/*.js files are committed; rerun `npm run build:api` after changing anything under server/ or src/ai/.
import { stdout } from 'node:process'
import { build } from 'rolldown'

const BANNER = '// GENERATED FILE. Do not edit: run `npm run build:api` (source: server/entries/ and server/).'

for (const name of ['plan', 'assistant', 'status']) {
  await build({
    input: `server/entries/${name}.ts`,
    platform: 'node',
    logLevel: 'warn',
    external: ['zod'],
    output: { file: `api/${name}.js`, format: 'esm', minify: false, banner: BANNER },
  })
  stdout.write(`api/${name}.js\n`)
}
