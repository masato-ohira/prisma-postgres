import { Bool, OpenAPIRoute, Str } from 'chanfana'
import { z } from 'zod'

import { ProductsCreateWithoutOrderDetailsInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ProductView extends OpenAPIRoute {
  schema = {
    tags: ['Products'],
    summary: '製品詳細',
    request: {
      params: z.object({
        id: Str({ description: '製品ID' }),
      }),
    },
    responses: {
      '200': {
        description: '製品詳細を取得します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: ProductsCreateWithoutOrderDetailsInputObjectSchema,
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
    const { id } = data.params
    const product = await prisma.products.findUnique({
      where: { product_id: Number(id) },
    })

    if (product) {
      return {
        success: true,
        product,
      }
    }

    return Response.json(
      {
        success: false,
        error: '見つかりませんでした',
      },
      {
        status: 404,
      },
    )
  }
}
