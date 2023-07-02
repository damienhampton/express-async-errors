const Fastify = require("fastify");
const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", () => {
  return { hello: "world" };
});

fastify.get("/no-error", (_, res) => res.send("no errors"));

fastify.get("/sync-error", () => {
  throw Error("SYNCHRONOUS ERROR");
});

fastify.get("/async-error", async () => {
  throw Error("ASYNCHRONOUS ERROR");
});

fastify.get("/promise-reject", () => {
  return Promise.reject("PROMISE REJECTED");
});

fastify.get("/async-promise-reject", async () => {
  return Promise.reject("ASYNC PROMISE REJECTED");
});

fastify.setErrorHandler((error, request, reply) => {
  // Log error
  console.log("setErrorHandler", error);
  // Send error response
  reply.send(`Error: ${error.message}`);
});

async function main() {
  // Run the server!
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
