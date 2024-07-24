import { Bool, OpenAPIRoute } from 'chanfana'
import { z } from 'zod'

import { ProductsCreateWithoutOrderDetailsInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ProductAdd extends OpenAPIRoute {
  schema = {
    tags: ['Products'],
    summary: '製品登録',
    request: {
      body: {
        content: {
          'application/json': {
            schema: ProductsCreateWithoutOrderDetailsInputObjectSchema,
          },
        },
      },
    },
    responses: {
      '201': {
        description: '製品情報を登録します',
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
    const product = data.body

    await prisma.products.create({
      data: product,
    })

    return {
      success: true,
      product,
    }
  }
}
