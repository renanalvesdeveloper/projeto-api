import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        tags: ["Courses"],
        summary: "Get course by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.string().uuid(),
              name: z.string(),
              description: z.string().nullable(),
              // Adicione outros campos conforme seu schema
            }),
          }),
          404: z.null().describe("Course not found"),
        },
      },
    },
    async (request, reply) => {
      const { id: courseId } = request.params as { id: string };

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) {
        return { course: result[0] };
      }

      return reply.status(404).send(null);
    }
  );
};
