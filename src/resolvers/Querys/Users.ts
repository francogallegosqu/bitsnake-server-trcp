import { createRouter } from '../../router/createRouter'
import * as JWT from '../../auth/jwt'
import { encrypt, decrypt } from '../../utils'
import * as trpc from '@trpc/server'
export const all = createRouter().query('all', {
  resolve({ ctx }) {
    const result = JWT.getUserToken(ctx)
    console.log('resultado', result)
    if (result == null) {
      throw new trpc.TRPCError({
        code: 'UNAUTHORIZED',
        message: 'not permitted!',
      })
    }
    // console.log('[result]', result)
    // 1,000,000,000
    // 1000000000000
    const encrypted = encrypt('detallesdsdsdds')
    const decrypted = decrypt(encrypted)
    return true
  }
})
