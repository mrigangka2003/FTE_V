import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

import { PORT } from './config/constants.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'
import type { AppVariables } from './types/index.js'

const app = new Hono<{ Variables: AppVariables }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api', routes)

app.onError(errorHandler)

app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404)
})

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})