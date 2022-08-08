import { createRouter } from "../router/createRouter"
import * as trpc from "@trpc/server"
import { z } from "zod"
import type { FastifyCookieOptions } from '@fastify/cookie'
// import cookie from "@fastify/cookie"
import * as cookie from "cookie"
import * as Utils from "../utils"
const MAX_SESSIONS = 3
const ONE_WEEK = 60 * 60 * 24 * 7

const input = z.object({
  name: z.string(),
  password: z.string(),
})

const resolve = async ({ input, ctx }: any) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      name: input.name,
    },
    include: {
      sessions: true,
    }
  })

  if (!user)
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message: "User does not exist",
    })
  // console.log('[user]', user)
  const isAboveMax = user.sessions.length > MAX_SESSIONS
  const isPassword = await Utils.compare(input.password, user.password)

  if (!isPassword)
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message: "Incorrect password",
    })
  if (isAboveMax) user.sessions.shift()

  // Add session
  const session = await ctx.prisma.session.create({
    data: {
      userId: user.id,
    },
  })

  const token = await Utils.tokenSign({
    name: user.name,
    sessionId: session.id,
    hash: Utils.hash(user.name),
  })

  // Clear output
  user.password = ""
  ctx.res.header('set-cookie', cookie.serialize('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }))
  return user
}

export const signIn = createRouter().mutation("SignIn", {
  input,
  resolve,
})

