import { createRouter } from '../../router/createRouter'
import * as JWT from '../../auth/jwt'
import * as trpc from '@trpc/server'
const resolve = async ({ ctx }) => {
  const jwt = JWT.getUserToken(ctx)
  if (jwt == null) {
    throw new trpc.TRPCError({
      code: 'UNAUTHORIZED',
      message: 'not permitted!',
    })
  }
  await ctx.prisma.session.delete({
    where: {
      id: jwt['sessionId'],
    },
  })

  return true
}

export const signOut = createRouter().query('signOut', {
  resolve,
})
