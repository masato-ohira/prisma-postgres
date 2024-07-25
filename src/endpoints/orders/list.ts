import { z } from '@hono/zod-openapi'
import { Bool, OpenAPIRoute } from 'chanfana'

import {
  OrderDetailsCreateWithoutOrdersInputObjectSchema,
  OrdersCreateInputObjectSchema,
  OrdersFindManySchema,
  PostsCreateInputObjectSchema,
} from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class OrderList extends OpenAPIRoute {
  schema = {
    tags: ['Orders'],
    summary: '注文一覧',
    request: {
      query: OrdersFindManySchema.pick({
        cursor: true,
        take: true,
        skip: true,
        distinct: true,
      }),
    },
    responses: {
      '200': {
        description: '注文一覧を取得します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: z
                    .object({
                      order_id: z.number(),
                    })
                    .array(),
                }),
              }),
            }),
          },
        },
      },
    },
  }

  async handle() {
    const data = await this.getValidatedData<typeof this.schema>()
    const query = data.query
    const orders = await prisma.orders.findMany(query)

    return {
      success: true,
      orders,
    }
  }
}
