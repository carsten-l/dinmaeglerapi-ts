import { serve } from '@hono/node-server'
import app from './app.ts'

console.log("Application starting...")
console.log("PORT:", process.env.PORT)

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
console.log("Server started");
