import { z } from '@hono/zod-openapi'
import { Arr, Bool, OpenAPIRoute } from 'chanfana'

import {
  SalesCreateWithoutOrdersInputObjectSchema,
  SalesFindManySchema,
} from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class SaleList extends OpenAPIRoute {
  schema = {
    tags: ['Sales'],
    summary: '売上一覧',
    request: {
      query: SalesFindManySchema.pick({
        cursor: true,
        take: true,
        skip: true,
        distinct: true,
      }),
    },
    responses: {
      '200': {
        description: '売上一覧を取得します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                sales: Arr(SalesCreateWithoutOrdersInputObjectSchema),
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
    const orders = await prisma.sales.findMany({
      ...query,
      include: {
        Orders: true,
      },
    })

    return {
      success: true,
      orders,
    }
  }
}
