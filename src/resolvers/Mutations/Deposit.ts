
import { createRouter } from '../../router/createRouter'
import { z } from 'zod'
import * as trpc from '@trpc/server'
import * as JWT from '../../auth/jwt'
import * as utils from '../../utils'
const input = z.object({
    coin: z.string(),
    amount: z.number(),
    from: z.string(),
    to: z.string(),
})

const resolve = async ({ input, ctx }: any) => {
    // auth
    const result = JWT.getUserToken(ctx)
    if (!result) throw new trpc.TRPCError({
        code: 'UNAUTHORIZED',
        message: 'not permitted!',
    })
    console.log('[result]', result)
    const params = {
        'merchantId': '123456728',
        'merchantTradeNo': '1246',
        'tradeType': 'WEB',
        'totalFee': '0.01',
        'currency': 'USDT',
        'productType': 'Paquete 1',
        'productName': 'Alimento',
        'productDetail': 'Crecimiento X2'
    }
    const order = await utils.baseRequest(params).post('/binancepay/openapi/order', params)
    // let user = await ctx.prisma.user.findUnique({
    //     where: {
    //         email: result['email'],
    //     },
    // })
    // let deposit = input
    // deposit.userId = user.id
    // await ctx.prisma.deposit.create({
    //     data: deposit
    // })
    return order
}

export const deposit = createRouter().mutation('deposit', {
    input,
    resolve,
})