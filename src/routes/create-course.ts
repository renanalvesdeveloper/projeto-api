import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  // Rota para criar um curso, ambas compartilham o mesmo caminho/recurso, mas comm métodos diferentes.
  server.post(
    "/courses",
    {
      schema: {
        tags: ["Courses"], // Define a tag para a documentação Swagger
        description: "Cria um novo curso", // Descrição da rota
        summary: "Criação de curso", // Resumo da rota
        body: z.object({
          name: z.string().min(1, "Nome do curso é obrigatório!"), // Validação do nome do curso usando Zod
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Curso criado com sucesso!"),
        },
      },
    },
    async (request, reply) => {
      const courseName = request.body.name;

      const result = await db
        .insert(courses)
        .values({ name: courseName })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
