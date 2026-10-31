import { handleNode, readEnv } from '../node'
import type { NodeReq, NodeRes } from '../node'

/** Vercel Function: GET /api/status. Reports whether live AI is configured, never the key itself. */
export default async function handler(req: NodeReq, res: NodeRes) {
  await handleNode('status', req, res, readEnv(process.env))
}
