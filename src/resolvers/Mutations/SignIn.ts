import { createRouter } from '../../router/createRouter'
import { z } from 'zod'
// import type { FastifyCookieOptions } from '@fastify/cookie'
// import cookie from "@fastify/cookie"
import * as trpc from '@trpc/server'
import * as cookie from 'cookie'
import * as JWT from '@src/auth/jwt'

const MAX_SESSIONS = 3
const ONE_WEEK = 60 * 60 * 24 * 7

const input = z.object({
  email: z.string(),
  password: z.string(),
})

const resolve = async ({ input, ctx }: any) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      sessions: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  })

  if (!user)
    throw new trpc.TRPCError({
      code: 'BAD_REQUEST',
      message: 'User does not exist',
    })

  const isAboveMax = user.sessions.length > MAX_SESSIONS
  const isPassword = await JWT.compare(input.password, user.password)

  if (!isPassword)
    throw new trpc.TRPCError({
      code: 'BAD_REQUEST',
      message: 'Incorrect password',
    })

  // Remove oldest session
  if (isAboveMax) {
    await ctx.prisma.session.delete({
      where: {
        id: user.sessions[0].id,
      },
    })
  }

  // Add session
  const session = await ctx.prisma.session.create({
    data: {
      userId: user.id,
    },
  })

  const token = await JWT.tokenSign({
    email: user.email,
    sessionId: session.id,
    hash: JWT.hash(user.email),
  })

  // Clear output
  user.password = ''
  ctx.res.header(
    'set-cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      maxAge: ONE_WEEK, // 1 week
    })
  )
  return user
}

export const signIn = createRouter().mutation('SignIn', {
  input,
  resolve,
})
