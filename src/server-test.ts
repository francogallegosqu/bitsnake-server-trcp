import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { createContext } from './router/context'
import { appRouter } from './router/index'

const server = fastify()

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
})

const main = async () => {
    let URL = null
    try {
        await server.listen({ port: 3000 })
        URL = `http://localhost:${3000}/trpc`

        console.log(`🚀 Server ready at ${URL}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
    return { server: server, url: URL }
}

export default main