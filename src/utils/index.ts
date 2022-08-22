require('dotenv').config()
import axios from 'axios'
import crypto from 'crypto'
// Keys
const apiKey = process.env.apiKey
const apiSecret = process.env.apiSecret
const baseURL = process.env.baseURL
const privateKey = process.env.privateKey
// Encript
const key = crypto.createHash('sha256').update(privateKey, 'ascii').digest()
const iv = '1234567890123456' //vectorial

export const hash = () => {
  return crypto.randomBytes(32).toString('hex').substring(0, 32)
}

export const hashSignature = (input) => {
  return crypto.createHmac('sha512', apiSecret).update(input).digest('hex')
}

export const baseRequest = (params) => {
  const timestamp = Date.now()
  const nonce = hash()
  const toSign = timestamp + '\n' + nonce + '\n' + JSON.stringify(params) + '\n'
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

export const encrypt = (secret) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  cipher.update(secret, 'utf8')
  const encrypted = cipher.final('base64')
  console.log('Encrypted: %s', encrypted)
  return encrypted
}

export const decrypt = (encrypted) => {
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  // decipher.setAutoPadding(false)
  decipher.update(encrypted, 'base64')

  const decrypted = decipher.final('utf8')
  console.log('Decrypted: %s', decrypted)
  return decrypted
}
