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
import crypto from "crypto";
import { db } from "./src/database/client.ts"; // Importando o cliente do banco de dados
import { courses } from "./src/database/schema.ts";
import { eq } from "drizzle-orm";

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
});

// const cursos = [
//   { id: "1", name: "Curso de Node.js" },
//   { id: "2", name: "Curso de JavaScript" },
//   { id: "3", name: "Curso de React" },
// ];

server.get("/courses", async (request, reply) => {
  //Rota para listar cursos
  // Retorna a lista de cursos
  const result = await db
    .select({
      id: courses.id,
      name: courses.name,
    })
    .from(courses); // Consulta ao banco de dados
  return reply.send({ courses: result }); // Envia a resposta com os cursos
});

//criando uma rota para buscar um curso pelo id
server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params; //criando um tipo para os parâmetros da rota
  const courseId = params.id; // Extrai o ID do curso dos parâmetros da rota

  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId)); // Consulta ao banco de dados para buscar o curso pelo ID

  if (result.length > 0) {
    return { course: result[0] };
  } else {
    return reply.status(404).send({ message: "Curso não encontrado!" });
  }
});

// // Rota para criar um curso, ambas compartilham o mesmo caminho/recurso, mas comm métodos diferentes.
// server.post("/courses", (request, reply) => {
//   type body = { name: string }; // Define o tipo do corpo da requisição

//   const body = request.body as body; // Extrai o corpo da requisição e o tipa como 'body'

//   // Verifica se o corpo da requisição contém o nome do curso
//   const courseName = body.name; // Extrai o nome do curso do corpo da requisição

//   if (!courseName) {
//     return reply.status(400).send({ message: "Nome do curso é obrigatório!" });
//   }

//   // Gera um ID único para o novo curso
//   const cursoId = crypto.randomUUID();

//   // Lógica para criar um novo curso
//   cursos.push({
//     id: cursoId,
//     name: courseName,
//   });
//   return reply.status(201).send({ cursoId }); //201 é o código de criação
// });

server
  .listen({ port: 3000 })
  .then(() => {
    console.log("Server is running on port 3000");
  })
  .catch((err) => {
    console.error("Error starting server:", err);
  });
