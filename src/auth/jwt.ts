import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const APP_SECRET = 'TypeGraphQL'

export const getUserToken = (ctx) => {
  const headers = ctx.req.raw.rawHeaders
  const cookie = headers.find(element => element.includes('token') ? element : '')
  if (cookie.search('token') != -1) {
    const token = cookie.replace('token=', '')
    const result = jwt.verify(token, APP_SECRET)
    console.log('result', result)
    return result
  }
  console.log('fuera input')
  return {}
}

export const tokenSign = (user) => {
  return jwt.sign(user, APP_SECRET)
}

export const hash = async (password: any) => {
  return await bcrypt.hash(password, 10)
}

export const compare = async (passwordOne: any, passwordTwo: any) => {
  return await bcrypt.compare(passwordOne, passwordTwo)
}
