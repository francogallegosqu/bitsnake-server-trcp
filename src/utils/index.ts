import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const APP_SECRET = "TypeGraphQL"

const options = {
  algorithm: "RS256",
}

export const getUserToken = async (ctx: any) => {
  const cookie = ctx.req.raw.rawHeaders.pop()
  if (cookie.search("token") != -1) {
    const token = cookie.replace("token=", "")
    const result = jwt.verify(token, APP_SECRET)
    return result
  }
  return undefined
}

export const tokenSign = (user: any) => {
  return jwt.sign(user, APP_SECRET)
}

export const hash = async (password: any) => {
  return await bcrypt.hash(password, 10)
}

export const compare = async (passwordOne: any, passwordTwo: any) => {
  return await bcrypt.compare(passwordOne, passwordTwo)
}
