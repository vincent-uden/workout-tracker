import postgres from "postgres";
import { env } from "../env.js";

declare global {
  var sql: postgres.Sql<{}>;
}

export const sql = global.sql || postgres(env.PSQL_URL);
