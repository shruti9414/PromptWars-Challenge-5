import { handleNode, readEnv } from '../node'
import type { NodeReq, NodeRes } from '../node'

/** Vercel Function: POST /api/assistant. */
export default async function handler(req: NodeReq, res: NodeRes) {
  await handleNode('assistant', req, res, readEnv(process.env))
}
