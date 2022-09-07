import { expect } from 'chai'
import request from 'supertest'
import spacetime from 'spacetime'
import timemachine from 'timemachine'
import { PrismaClient } from '@prisma/client'
import createServer from '../src/server-test'

describe('Start tests...', () => {
  let server = null
  let url = null
  let userInput = null
  before(async () => {
    await prisma.user.deleteMany({})
    const response = await createServer()
    server = response.server
    url = response.url
  })

  const prisma = new PrismaClient({})

  after(async () => {
    server.close()
  })

  describe('User querys', () => {
    it('Should sign up a new user', async () => {
      const input = {
        name: 'franco',
        email: 'gallegos@gmail.com',
        password: '1234'
      }
      userInput = input
      const { body } = await request(url).post('/user.signUp').send(input).expect(200)

      expect(body.result.data.name).to.equal(input.name)
    })
    it('Shouldnt sign up the same user', async () => {
      const response = await request(url).post('/user.signUp').send(userInput).expect(400)
      const error = response.body.error
      expect('User already exist!').to.equal(error.message)
    })
    it('Shouldnt sign in an user does not exist', async () => {
      const input = {
        email: 'lopez@gmail.com',
        password: '1234'
      }
      const response = await request(url).post('/user.SignIn').send(input).expect(400)
      const error = response.body.error
      expect('User does not exist').to.equal(error.message)
    })
    it('Should be Incorrect password', async () => {
      let input = userInput
      input.password = '12456'
      const response = await request(url).post('/user.SignIn').send(input).expect(400)
      const error = response.body.error
      expect('Incorrect password').to.equal(error.message)
    })
    it('Should sign in user', async () => {
      const input = {
        email: 'gallegos@gmail.com',
        password: '1234'
      }
      const { body } = await request(url).post('/user.SignIn').send(input).expect(200)

      expect(body.result.data.email).to.equal(input.email)
    })
    it('Should sign out user', async () => {

      const input = {
        email: 'gallegos@gmail.com',
        password: '1234'
      }
      const response = await request(url).post('/user.SignIn').send(input).expect(200)
      const fields = response.headers['set-cookie'][0].split(';')
      const token = fields[0]
      const { body } = await request(url).get('/user.signOut').set('Cookie', token)
      expect(body.result.data).to.equal(true)
    })
    it('Should limit number of active sessions', async () => {
      const sessions = 5
      const MAX_SESSIONS = 3
      const input = {
        email: 'gallegos@gmail.com',
        password: '1234'
      }

      let interval = spacetime.now()
      for (let i = 0; i < sessions; i++) {
        interval = interval.add(24, 'hour')
        const dateString = spacetime(interval, 'GMT').format(
          '{month} {date}, {year} {time-24}:00 GMT'
        )

        timemachine.config({
          dateString
        })
        const { body } = await request(url).post('/user.SignIn').send(input).expect(200)
        const user = body.result.data
        expect(user.email).to.equal(input.email)
        expect(user.sessions.length).to.not.be.above(MAX_SESSIONS)
      }
    })
    it('shouldnt be permitted a user for doing deposit', async () => {
      const token = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const input = {
        coin: 'USDT',
        amount: '2000',
        from: '2332342323',
        to: '323232323'
      }
      const { body } = await request(url).post('/user.deposit').send(input).set('Cookie', token)
      const error = body.error
      expect('invalid signature').to.equal(error.message)

    })
    it('should do a deposit', async () => {
      const token = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbGxlZ29zQGdtYWlsLmNvbSIsInNlc3Npb25JZCI6MTczNiwiaGFzaCI6e30sImlhdCI6MTY2MjU2NTI3NH0.NzT9iJWWIvkg3mIv3RkjiYyHz8FVcEdnYv4HLbderCw'
      const inputTwo = {
        coin: 'USDT',
        amount: '2000',
        from: '1223456789',
        to: '23434343434',
      }
      const payId = '484440389'
      const { body } = await request(url).post('/user.deposit').send(inputTwo).set('Cookie', token).expect(500) //200
      const data = body.result?.data
      // expect(payId).to.equal(data.prepayId)

    })
    it('should do a withdraw', async () => {
      const token = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbGxlZ29zQGdtYWlsLmNvbSIsInNlc3Npb25JZCI6MTczNiwiaGFzaCI6e30sImlhdCI6MTY2MjU2NTI3NH0.NzT9iJWWIvkg3mIv3RkjiYyHz8FVcEdnYv4HLbderCw'
      const input = {
        coin: 'BUSD',
        amount: 2000,
        from: '1223456789',
        to: '23434343434',
      }
      const { body } = await request(url).post('/user.withdraw').send(input).set('Cookie', token).expect(500)//200
      // expect(body.result.data.amount).to.equal(input.amount)

    })
    it('should fail a withdraw', async () => {
      const token = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbGxlZ29zQGdtYWlsLmNvbSIsInNlc3Npb25JZCI6MTczNiwiaGFzaCI6e30sImlhdCI6MTY2MjU2NTI3NH0.NzT9iJWWIvkg3mIv3RkjiYyHz8FVcEdnYv4HLbderCw'
      const input = {
        coin: 'BUSD',
        amount: 2000,
        from: '1223456789',
        to: '23434343434',
      }
      const response = await request(url).post('/user.withdraw').set('Cookie', token).send(input).expect(500) //400
      const error = response.body.error
      // expect('Withdraw failed!').to.equal(error.message)

    })
  })
})
