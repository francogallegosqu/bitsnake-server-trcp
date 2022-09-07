
import { createRouter } from '../../router/createRouter'
import { any, z } from 'zod'
import * as trpc from '@trpc/server'
import * as JWT from '../../auth/jwt'
import * as utils from '../../utils'
const input = z.object({
    coin: z.string(),
    amount: z.string(),
    from: z.string(),
    to: z.string(),
})

const resolve = async ({ input, ctx }: any) => {
    // auth
    const result = JWT.getUserToken(ctx)
    if (result == null) {
        throw new trpc.TRPCError({
            code: 'UNAUTHORIZED',
            message: 'not permitted!',
        })
    }
    const params = {
        "env": {
            "terminalType": "WEB"
        },
        "merchantTradeNo": utils.hash(),//Numero distinto por transaccion
        "orderAmount": input.amount,//monto de orden
        "currency": input.coin,//tipo de moneda
        "goods": {
            "goodsType": "02",//Virtual Goods
            "goodsCategory": "7000", //7000: Entertainament & Collection
            "referenceGoodsId": utils.hash(), //id unique
            "goodsName": "Package 1",
            "goodsDetail": "package from snake"
        }
    }

    const order = await utils.baseRequest(params).post('/binancepay/openapi/order', params)
    if (!order.code) {
        throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Order did not created!',
        })
    }

    input.user = { connect: { email: result['email'] } }
    const deposit = await ctx.prisma.deposit.create({
        data: input
    })

    if (!deposit) {
        throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Deposit did not created!',
        })
    }

    return order
}


export const deposit = createRouter().mutation('deposit', {
    input,
    resolve,
})