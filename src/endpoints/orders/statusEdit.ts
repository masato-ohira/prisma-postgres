import { Bool, OpenAPIRoute, Str } from 'chanfana'
import { omit } from 'lodash-es'
import { z } from 'zod'

import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

const StatusSchema = z.object({
  status_id: z.number().min(1),
})

export class OrderStatusEdit extends OpenAPIRoute {
  schema = {
    tags: ['Orders'],
    summary: '注文ステータス変更',
    request: {
      params: z.object({
        id: Str({ description: 'ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: StatusSchema,
          },
        },
      },
    },
    responses: {
      '200': {
        description: '注文ステータスを変更します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: StatusSchema,
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
    const { status_id } = data.body

    try {
      const order = await prisma.orders.update({
        where: { order_id: Number(id) },
        data: { status_id },
      })
      const detail = await prisma.orderDetails.findFirst({
        where: { order_id: Number(id) },
      })
      const product = await prisma.products.findUnique({
        where: { product_id: detail?.product_id },
      })

      if (status_id === 2) {
        const sale = await prisma.sales.create({
          data: {
            ...omit(order, ['order_date', 'status_id']),
            sale_date: dayjs().toISOString(),
            profit:
              Number(order.total_amount) -
              Number(product?.material_cost) * Number(detail?.quantity),
          },
        })

        if (sale) {
          return {
            success: true,
            sale,
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
    } catch (error) {
      console.log(error)
      return Response.json(
        {
          success: false,
          error: '予期せぬエラー',
        },
        {
          status: 500,
        },
      )
    }
  }
}
