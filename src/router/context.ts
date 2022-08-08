import { PrismaClient } from '@prisma/client'
import { inferAsyncReturnType } from "@trpc/server"
// import * as trpcNext from '@trpc/server/adapters/next'
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"
import fastify from 'fastify'

const app = fastify()
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
})

export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  return {
    req,
    res,
    prisma,
    register: app.register,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
