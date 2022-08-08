import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext } from "./router/context";
import { appRouter } from "./router/index";

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

(async () => {
  try {
    await server.listen({ port: 3000 });
    const URL = `http://localhost:${3000}/trpc`;

    console.log(`🚀 Server ready at ${URL}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
