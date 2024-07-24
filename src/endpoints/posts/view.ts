import { Bool, OpenAPIRoute, Str } from 'chanfana'
import { z } from 'zod'

import { PostsCreateInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class PostView extends OpenAPIRoute {
  schema = {
    tags: ['Posts'],
    summary: '固有の投稿を取得します',
    request: {
      params: z.object({
        id: Str({ description: '投稿ID' }),
      }),
    },
    responses: {
      '200': {
        description: 'IDに対応する投稿を取得',
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
    const { id } = data.params
    const post = await prisma.posts.findUnique({
      where: { id: Number(id) },
    })

    if (post) {
      return {
        success: true,
        post,
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
