import { fromHono } from 'chanfana'
import { Hono } from 'hono'

import { OrderAdd } from './endpoints/orders/add'
import { OrderList } from './endpoints/orders/list'
import { OrderStatus } from './endpoints/orders/status'
import { OrderStatusEdit } from './endpoints/orders/statusEdit'
import { ProductList } from './endpoints/products/list'
import { SaleList } from './endpoints/sales/list'

const app = new Hono()
const openapi = fromHono(app, {
  docs_url: '/',
})

openapi.get('/api/products', ProductList)

openapi.get('/api/orders', OrderList)
openapi.post('/api/orders/add', OrderAdd)
openapi.get('/api/orders/status', OrderStatus)
openapi.patch('/api/orders/:id/status', OrderStatusEdit)

openapi.get('/api/sales', SaleList)

export default app
