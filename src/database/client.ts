import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL, {
  // Configurações adicionais do Drizzle ORM, se necessário
  logger: true, // Habilita o log de consultas SQL
  // outras opções...
});
