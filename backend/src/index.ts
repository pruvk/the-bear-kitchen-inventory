import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

const app = new Hono()


app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.get('/api/items', async (c) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return c.json(items, 200)
  } catch (err) {
    console.error(err)
    return c.json({ error: "Failed to fetch kitchen items, Chef!" })
  }
})

app.post('/api/items', async (c) => {
  try {
    const body = await c.req.json();

    const newItem = await prisma.item.create({
      data: {
        name: body.name,
        category: body.category,
        measurement: body.measurement
      }
    })

    return (
      c.json(newItem, 201)
    )
  } catch (err) {
    console.error(err)
    return c.json({ error: "failed to create kitchen item, Chef!" }, 500)
  }
})

export default {
  port: 3000,
  fetch: app.fetch,
}