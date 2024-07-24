import { Bool, OpenAPIRoute } from 'chanfana'
import { z } from 'zod'

import { PostsCreateInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class PostAdd extends OpenAPIRoute {
  schema = {
    tags: ['Posts'],
    summary: '投稿を追加します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: PostsCreateInputObjectSchema,
          },
        },
      },
    },
    responses: {
      '201': {
        description: '作成した投稿を出力',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: PostsCreateInputObjectSchema,
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
    const post = data.body

    await prisma.posts.create({
      data: post,
    })

    return {
      success: true,
      post,
    }
  }
}
