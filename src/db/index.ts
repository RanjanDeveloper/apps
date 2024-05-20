

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres'
import * as schema from './schemas';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!)
export const db = drizzle(client,{schema});

// //mysql
// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2";
// import * as schema from '@/db/schemas';
// export const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password:"",
//   database: "demo",
//   multipleStatements: true,
// });
// export const db = drizzle(connection,{schema,mode:'default'});
