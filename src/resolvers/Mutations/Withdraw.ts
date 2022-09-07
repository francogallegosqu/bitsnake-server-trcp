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
    const params = {
        "requestId": "samplebatcht1234",
        "batchName": "Snake batch test",
        "currency": input.coin,
        "totalAmount": input.amount,
        "totalNumber": 1,
        "bizScene": "SETTLEMENT",

        "transferDetailList": [
            {
                "merchantSendId": "22231313131",
                "transferAmount": input.coin,
                "receiveType": "PAY_ID",
                "transferMethod": "SPOT_WALLET",
                "receiver": "354205155",//quien recibe
                "remark": "test1"
            },
        ]
    }
    const order = await utils.baseRequest(params).post('/binancepay/openapi/payout/transfer', params)
    if (!order.status) {
        throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Withdraw failed!',
        })
    }
    let user = await ctx.prisma.user.findUnique({
        where: {
            email: result['email'],
        },
    })
    let deposit = input
    deposit.userId = user.id
    await ctx.prisma.deposit.create({
        data: deposit
    })
    return order
}

export const withdraw = createRouter().mutation('withdraw', {
    input,
    resolve,
})
