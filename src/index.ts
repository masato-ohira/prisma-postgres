import { fromHono } from 'chanfana'
import { Hono } from 'hono'

import { PostAdd } from './endpoints/posts/add'
import { PostDelete } from './endpoints/posts/delete'
import { PostList } from './endpoints/posts/list'
import { PostView } from './endpoints/posts/view'
import { ProductAdd } from './endpoints/products/add'
import { ProductDelete } from './endpoints/products/delete'
import { ProductList } from './endpoints/products/list'
import { ProductView } from './endpoints/products/view'

const app = new Hono()
const openapi = fromHono(app, {
  docs_url: '/',
})

// openapi.get('/api/posts', PostList)
// openapi.get('/api/posts/:id', PostView)
// openapi.post('/api/posts', PostAdd)
// openapi.delete('/api/posts/:id', PostDelete)

openapi.get('/api/products', ProductList)
openapi.get('/api/products/:id', ProductView)
openapi.post('/api/products', ProductAdd)
openapi.delete('/api/products/:id', ProductDelete)

export default app
