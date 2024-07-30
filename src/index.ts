import { fromHono } from 'chanfana'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { trimTrailingSlash } from 'hono/trailing-slash'

import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import { i18nextProps } from './locale'

import { OrderAdd } from './endpoints/orders/add'
import { OrderList } from './endpoints/orders/list'
import { OrderStatus } from './endpoints/orders/status'
import { OrderStatusEdit } from './endpoints/orders/statusEdit'
import { ProductList } from './endpoints/products/list'
import { SaleList } from './endpoints/sales/list'

const app = new Hono()

// locale setting
// ------------------------------
i18next.init(i18nextProps)
z.setErrorMap(zodI18nMap)

// Hono
// ------------------------------
app.use(trimTrailingSlash())
app.use('*', cors())

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
