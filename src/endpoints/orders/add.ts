import { Bool, Num, OpenAPIRoute } from 'chanfana'
import dayjs from 'dayjs'
import { z } from 'zod'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const OrderSchema = z.object({
  product_id: Num().min(1),
  quantity: Num().min(1),
})

export class OrderAdd extends OpenAPIRoute {
  schema = {
    tags: ['Orders'],
    summary: 'オーダー追加',
    request: {
      body: {
        content: {
          'application/json': {
            schema: OrderSchema,
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'オーダーを追加します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                order: OrderSchema,
              }),
            }),
          },
        },
      },
    },
  }

  async handle() {
    const data = await this.getValidatedData<typeof this.schema>()
    const { product_id, quantity } = data.body
    try {
      const product = await prisma.products.findUnique({
        where: { product_id },
      })
      const status = await prisma.orderStatus.findMany()

      const price = product?.price

      const order = await prisma.orders.create({
        data: {
          order_date: dayjs().toISOString(),
          total_amount: Number(price) * quantity,
          status_id: status[0].status_id,
        },
      })

      const order_detail = await prisma.orderDetails.create({
        data: {
          product_id,
          order_id: order.order_id,
          quantity,
          price: Number(price),
        },
      })

      return {
        success: true,
        order: {
          ...order,
          order_detail,
        },
      }
    } catch (error) {
      return {
        success: false,
        info: '予期せぬエラー',
      }
    }
  }
}
