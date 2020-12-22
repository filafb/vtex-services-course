import { Clients } from '../clients/index'
import { EventContext } from '@vtex/api'
//import { COURSE_ENTITY } from '../utils/constants'

export async function updateLiveUsers(ctx: EventContext<Clients>) {
  const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()
  const test = await ctx.clients.masterdata.searchDocuments({
    dataEntity: 'RM',
    fields: ['orderId', 'email'],
    schema: 'v1',
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `orderId=1082002145762-01`
  })
  console.log('LIVE USERS', test)
  await Promise.all(
    liveUsersProducts.map(async ({
      slug,
      liveUsers
    }) => {
      try {
        const [savedProduct] = await ctx.clients.masterdata.searchDocuments<{
          id: string
          count: number
          slug: string
        }>({
          dataEntity: 'ZZ',
          fields: ['count', 'id', 'slug'],
          pagination: {
            page: 1,
            pageSize: 1
          },
          schema: 'v1',
          where: `slug=${slug}`
        })
        console.log('SAVED PRODUCT', savedProduct)
        console.log('slug', slug)

        const newDoc = await ctx.clients.masterdata.createOrUpdateEntireDocument({
          dataEntity: 'ZZ',
          fields: {
            count: liveUsers,
            slug,
          },
          id: savedProduct?.id,
          schema: 'v1'
        })
        console.log('new Doc', newDoc)
      } catch (error) {
        console.log('Error on slug:', slug)
        console.log('This error', error)
      }
    })
  )
  return true
}