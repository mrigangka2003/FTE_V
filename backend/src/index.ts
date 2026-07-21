import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import { cors } from 'hono/cors'

import { PORT } from './config/constants'
import routes from './routes'
import { errorHandler } from './middlewares/error.middleware'
import type { AppVariables } from './types'

const app = new Hono<{ Variables: AppVariables }>()

app.use('*', cors({
  origin: (origin) => origin,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

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