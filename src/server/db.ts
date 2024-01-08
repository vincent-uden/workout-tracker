import postgres from 'postgres'
import { env } from '../env.js';

const sql = postgres(
  env.PSQL_URL,
  { /* options */ }
); // will use psql environment variables

export default sql;
