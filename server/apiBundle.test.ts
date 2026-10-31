import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Vercel runs the committed api/*.js as plain Node ESM. Loading them in a real Node process (not Vite) catches
// unresolved imports, which made every function crash with FUNCTION_INVOCATION_FAILED.
describe('bundled Vercel functions', () => {
  it.each(['status', 'plan', 'assistant'])('api/%s.js loads in plain Node and answers', (name) => {
    const url = pathToFileURL(resolve('api', `${name}.js`)).href
    const script = `
      const m = await import(${JSON.stringify(url)});
      const res = { statusCode: 0, body: '', setHeader() {}, end(b) { this.body = b ?? ''; } };
      await m.default({ method: ${JSON.stringify(name === 'status' ? 'GET' : 'POST')}, url: '/api/${name}', headers: {}, body: {}, socket: {} }, res);
      process.stdout.write(JSON.stringify({ code: res.statusCode, body: res.body }));
    `
    const out = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', env: {} }))
    expect(out.code).toBeLessThan(500)
    expect(out.body.length).toBeGreaterThan(0)
  })
})
