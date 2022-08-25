import { expect } from "chai"
import request from "supertest"
import spacetime from "spacetime"
import timemachine from "timemachine"
import { PrismaClient } from '@prisma/client'
import createServer from '../server-test'


describe("bitsnake server", () => {
    const prisma = new PrismaClient({})
    describe("run server", () => {
        let server = null
        let url = null

        before(async () => {
            await prisma.user.deleteMany({})
            const response = await createServer()
            server = response.server
            url = response.url

        })

        after(async () => {
            server.close()
        })

        it("SignUP User", async () => {
            const input = {
                name: 'franco',
                email: 'gallegos@gmail.com',
                password: '1234'
            }
            const { body } = await request(url)
                .post('/user.signUp')
                .send(input)
                .expect(200)

            expect(body.result.data.name).to.equal(input.name)

        })
        it("SignIn User", async () => {
            const input = {
                email: 'gallegos@gmail.com',
                password: '1234'
            }
            const { body } = await request(url)
                .post('/user.SignIn')
                .send(input)
                .expect(200)

            expect(body.result.data.email).to.equal(input.email)
        })
        it("signOut User", async () => {
            const input = {
                email: 'gallegos@gmail.com',
                password: '1234'
            }
            const response = await request(url)
                .post('/user.SignIn')
                .send(input)
                .expect(200)

            const fields = response.headers['set-cookie'][0].split(';')
            const token = fields[0]
            const { body } = await request(url)
                .get('/user.signOut')
                .set('Cookie', token)
                .expect(200)
            // console.log('body', body.result)
            // expect(body.result.data.id).to.be('number')
        })
        it("SignIn more than one time", async () => {
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
                    dateString,
                })
                const { body } = await request(url)
                    .post('/user.SignIn')
                    .send(input)
                    .expect(200)
                const user = body.result.data
                expect(user.email).to.equal(input.email)
                expect(user.sessions.length).to.not.be.above(MAX_SESSIONS)
            }
        })

    })
})