require('dotenv').config()
import axios from 'axios'
import crypto from 'crypto'
const apiKey = process.env.apiKey
const apiSecret = process.env.apiSecret
const baseURL = process.env.baseURL


export const hash = () => {
    return crypto.randomBytes(32).toString('hex').substring(0, 32)
}

export const hashSignature = (ToSign) => {
    return crypto
        .createHmac('sha512', apiSecret)
        .update(ToSign)
        .digest('hex')
}

export const baseRequest = (params) => {
    const timestamp = Date.now()
    const nonce = hash()
    const toSign = timestamp + "\n" + nonce + "\n" + JSON.stringify(params) + "\n"
    const signature = hashSignature(toSign)
    return axios.create({
        baseURL,
        headers: {
            'content-type': 'application/json',
            'BinancePay-Timestamp': timestamp,
            'BinancePay-Nonce': nonce,
            'BinancePay-Certificate-SN': apiKey,
            'BinancePay-Signature': signature.toUpperCase()
        }
    })
}