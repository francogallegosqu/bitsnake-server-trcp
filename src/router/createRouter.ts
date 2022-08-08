import * as trpc from '@trpc/server'
import { Context } from './context'
// Base Route
export function createRouter() {
  return trpc.router<Context>()
}
