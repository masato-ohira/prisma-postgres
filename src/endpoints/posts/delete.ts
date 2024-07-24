import { Bool, OpenAPIRoute, Str } from 'chanfana'
import { z } from 'zod'

import { PostsCreateInputObjectSchema } from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class PostDelete extends OpenAPIRoute {
  schema = {
    tags: ['Posts'],
    summary: '投稿を削除します',
    request: {
      params: z.object({
        id: Str({ description: '投稿ID' }),
      }),
    },
    responses: {
      '200': {
        description: 'IDに対応する投稿を削除',
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

    const post = await prisma.posts.delete({
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
      { status: 404 },
    )
  }
}
