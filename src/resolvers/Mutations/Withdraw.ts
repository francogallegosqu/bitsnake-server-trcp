import { createRouter } from '../../router/createRouter'
import { z } from 'zod'
import * as trpc from '@trpc/server'
import * as JWT from '@src/auth/jwt'
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
        "requestId": "samplerequest1234",
        "batchName": "sample batch test",
        "currency": "BUSD",
        "totalAmount": 200.4,
        "totalNumber": 2,
        "bizScene": "SETTLEMENT",

        "transferDetailList": [
            {
                "merchantSendId": "22231313131",
                "transferAmount": 110.3,
                "receiveType": "PAY_ID",
                "transferMethod": "SPOT_WALLET",
                "receiver": "354205155",
                "remark": "test1"
            },

            {
                "merchantSendId": "21231313132",
                "transferAmount": 90.1,
                "receiveType": "PAY_ID",
                "transferMethod": "SPOT_WALLET",
                "receiver": "354205153",
                "remark": "test2"
            }

        ]
    }
    const order = await utils.baseRequest(params).post('/binancepay/openapi/payout/transfer', params)
    return order
}

export const withdraw = createRouter().mutation('withdraw', {
    input,
    resolve,
})
