/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

// Resolve .env root for both dev (TS source) and prod (compiled in build/)
const defaultRoot = new URL('../', import.meta.url); // dev: project root, prod: build/
const isBuildDir = defaultRoot.pathname.endsWith('/build/');
const appRoot = isBuildDir ? new URL('../', defaultRoot) : defaultRoot;

export default await Env.create(appRoot, {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | AI / Vector services
  |----------------------------------------------------------
  */
  OPENAI_API_KEY: Env.schema.string(),
  QDRANT_HOST: Env.schema.string({ format: 'host' }),
  QDRANT_PORT: Env.schema.number(),
})
