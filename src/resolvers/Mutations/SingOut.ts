import { createRouter } from '../../router/createRouter'
import * as JWT from '@src/auth/jwt'

const resolve = async ctx => {
  const jwt = await JWT.getUserToken(ctx)
  const session = await ctx.prisma.session.delete({
    where: {
      id: jwt['sessionId'],
    },
  })

  return session
}

export const signOut = createRouter().query('signOut', {
  resolve,
})
