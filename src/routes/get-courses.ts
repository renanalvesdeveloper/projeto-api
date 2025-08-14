import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { z } from "zod";
import { courses } from "../database/schema.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["Courses"], // Define a tag para a documentação Swagger
        description: "Lista todos os cursos", // Descrição da rota
        summary: "Get all courses", // Resumo da rota
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.string().uuid(), // Validação do ID do curso
                name: z.string(), // Validação do nome do curso
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      //Rota para listar cursos
      // Retorna a lista de cursos
      const result = await db
        .select({
          id: courses.id,
          name: courses.name,
        })
        .from(courses); // Consulta ao banco de dados
      return reply.send({ courses: result }); // Envia a resposta com os cursos
    }
  );
};
