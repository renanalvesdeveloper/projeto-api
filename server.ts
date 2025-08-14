//servidor criado na unha

/* const http = require("http");

const server = http.createServer((request, reply) => {
  reply.write("Helo World!");
  reply.end();
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

 */

//criando servidor com fastify
// const fastify = require("fastify");

// const crypto = require("crypto");

import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { createCourseRoute } from "./src/routes/create-course.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty", // Usando pino-pretty para formatação de logs
      options: {
        colorize: true, // Habilita cores nos logs
        translateTime: "HH:MM:ss Z", // Formato de data e hora
        ignore: "pid,hostname", // Ignora pid e hostname nos logs
      },
    },
  }, // Habilita o log do servidor
}).withTypeProvider<ZodTypeProvider>(); // Adiciona o provedor de tipos do Zod

if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API de Cursos",
        description: "API para gerenciar cursos",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform, // Usa a transformação do JSON Schema para Zod
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
  });
}

server.setValidatorCompiler(validatorCompiler); // Configura o validador global usando Zod
server.setSerializerCompiler(serializerCompiler); // Configura o serializador global usando Zod

server.register(createCourseRoute);
server.register(getCourseByIdRoute);
server.register(getCoursesRoute);
server
  .listen({ port: 3000 })
  .then(() => {
    console.log("Server is running on port 3000");
  })
  .catch((err) => {
    console.error("Error starting server:", err);
  });
