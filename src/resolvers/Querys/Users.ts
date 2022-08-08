import { createRouter } from '../../router/createRouter'
// import * as JWT from '@src/auth/jwt'

export const all = createRouter().query('all', {
  resolve({ ctx }) {
    // const result = JWT.getUserToken(ctx)
    // console.log('[result]', result)
    return true
  },
})
