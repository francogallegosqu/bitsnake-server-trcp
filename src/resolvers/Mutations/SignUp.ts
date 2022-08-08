import { createRouter } from '../../router/createRouter'
import { z } from 'zod'
import * as trpc from '@trpc/server'
import * as JWT from '@src/auth/jwt'

const input = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const resolve = async ({ input, ctx }: any) => {
  // Find user
  let user = await ctx.prisma.user.findUnique({
    where: {
      name: input.name,
    },
  })

  if (user) {
    throw new trpc.TRPCError({
      code: 'BAD_REQUEST',
      message: 'User already exist!',
    })
  }

  // Create user
  input.password = await JWT.hash(input.password)
  user = await ctx.prisma.user.create({
    data: input,
  })

  if (!user) {
    throw new trpc.TRPCError({
      code: 'BAD_REQUEST',
      message: 'User was not sing up!',
    })
  }

  return user
}

export const signUp = createRouter().mutation('signUp', {
  input,
  resolve,
})
