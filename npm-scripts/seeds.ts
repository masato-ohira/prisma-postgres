import { PrismaClient } from '@prisma/client'

// ❗Bunのバグがあり、トップレベルでないと
// ❗Seed投入コマンドは機能しない
// ❗awaitで警告が出ているが無視する
const prisma = new PrismaClient()

try {
  const products = await prisma.products.createManyAndReturn({
    data: [
      {
        product_id: 1,
        name: 'たこ焼き6個',
        slug: 'tako-6',
        price: 600,
        material_cost: 300,
      },
      {
        product_id: 2,
        name: 'たこ焼き12個',
        slug: 'tako-12',
        price: 1200,
        material_cost: 600,
      },
    ],
  })
  console.log(products)

  const status = await prisma.orderStatus.createManyAndReturn({
    data: [
      {
        status_id: 1,
        status_name: '未提供',
      },
      {
        status_id: 2,
        status_name: '提供済',
      },
      {
        status_id: 3,
        status_name: 'キャンセル',
      },
    ],
  })
  console.log(status)
} catch (error) {
  console.log({ error })
} finally {
  await prisma.$disconnect()
}
