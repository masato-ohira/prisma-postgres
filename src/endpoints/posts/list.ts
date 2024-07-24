import { z } from '@hono/zod-openapi'
import { Bool, OpenAPIRoute } from 'chanfana'

import {
  PostsCreateInputObjectSchema,
  PostsFindManySchema,
} from '@p/generated/zod/schemas'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class PostList extends OpenAPIRoute {
  schema = {
    tags: ['Posts'],
    summary: '投稿一覧を取得します',
    request: {
      query: PostsFindManySchema.pick({
        cursor: true,
        take: true,
        skip: true,
        distinct: true,
      }),
    },
    responses: {
      '200': {
        description: '投稿一覧を取得します',
        content: {
          'application/json': {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  data: PostsCreateInputObjectSchema.array(),
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
    const posts = await prisma.posts.findMany(query)

    return {
      success: true,
      posts,
    }
  }
}
