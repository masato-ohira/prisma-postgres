import { Bool, OpenAPIRoute, Str } from 'chanfana'
import { z } from 'zod'

import { ProductsCreateWithoutOrderDetailsInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ProductDelete extends OpenAPIRoute {
  schema = {
    tags: ['Products'],
    summary: '製品削除',
    request: {
      params: z.object({
        id: Str({ description: 'ID' }),
      }),
    },
    responses: {
      '200': {
        description: '製品を削除します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                product: ProductsCreateWithoutOrderDetailsInputObjectSchema,
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

    const product = await prisma.products.delete({
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
      { status: 404 },
    )
  }
}
