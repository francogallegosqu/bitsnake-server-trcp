import { createRouter } from '../../router/createRouter'
import * as JWT from '../../auth/jwt'

const resolve = async ({ ctx }) => {
  const jwt = await JWT.getUserToken(ctx)
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
