import { createRouter } from "../router/createRouter"
import { getUserToken } from '../utils/index'
const allUsers = createRouter()
    .query('user', {
        resolve({ ctx }) {
            const result = getUserToken(ctx)
            console.log('[result]', result)
            return true
        }
    })

export default allUsers