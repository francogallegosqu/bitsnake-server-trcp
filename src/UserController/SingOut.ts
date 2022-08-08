import { createRouter } from "../router/createRouter"
import { z } from 'zod'
import * as Utils from '../utils'
const resolve = async (ctx) => {
    const jwt = await Utils.getUserToken(ctx)
    const session = await ctx.prisma.session.delete({
        where: {
            id: jwt['sessionId'],
        },
    })

    return session
}


const signOut = createRouter()
    .query('signOut', {
        resolve
    })

export default signOut