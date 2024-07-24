import { z } from '@hono/zod-openapi'
import { Bool, OpenAPIRoute } from 'chanfana'

import {
  ProductsCreateWithoutOrderDetailsInputObjectSchema,
  ProductsFindManySchema,
} from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ProductList extends OpenAPIRoute {
  schema = {
    tags: ['Products'],
    summary: '製品一覧',
    request: {
      query: ProductsFindManySchema.pick({
        cursor: true,
        take: true,
        skip: true,
        distinct: true,
      }),
    },
    responses: {
      '200': {
        description: '製品一覧を取得します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: ProductsCreateWithoutOrderDetailsInputObjectSchema.array(),
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
    const products = await prisma.products.findMany(query)

    return {
      success: true,
      products,
    }
  }
}
