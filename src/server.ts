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
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' })
    const URL = `http://localhost:${3000}/trpc`

    console.log(`🚀 Server ready at ${URL}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}


main()
