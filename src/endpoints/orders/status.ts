import { z } from '@hono/zod-openapi'
import { Bool, OpenAPIRoute } from 'chanfana'

import { OrderStatusCreateWithoutOrdersInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class OrderStatus extends OpenAPIRoute {
  schema = {
    tags: ['Orders'],
    summary: '注文ステータス',
    responses: {
      '200': {
        description: '注文ステータスを取得します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: OrderStatusCreateWithoutOrdersInputObjectSchema.array(),
                }),
              }),
            }),
          },
        },
      },
    },
  }

  async handle() {
    const status = await prisma.orderStatus.findMany()

    return {
      success: true,
      status,
    }
  }
}
