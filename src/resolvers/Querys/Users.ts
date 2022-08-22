import { createRouter } from '../../router/createRouter'
// import * as JWT from '@src/auth/jwt'
import { encrypt, decrypt } from '../../utils'

export const all = createRouter().query('all', {
  resolve({ ctx }) {
    // const result = JWT.getUserToken(ctx)
    // console.log('[result]', result)
    // 1,000,000,000
    // 1000000000000
    const encrypted = encrypt('detallesdsdsdds')
    const decrypted = decrypt(encrypted)
    return true
  }
})
