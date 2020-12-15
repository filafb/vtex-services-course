import { Clients } from '../clients/index'
import { EventContext } from '@vtex/api'
import { COURSE_ENTITY } from '../utils/constants'

export async function updateLiveUsers(ctx: EventContext<Clients>) {
  const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()
  console.log('LIVE USERS', liveUsersProducts)
  await Promise.all(liveUsersProducts.map(async ({ slug, liveUsers }) => {
    try {
      const [saveProduct] = await ctx.clients.masterdata.searchDocuments<{
        id: string
        count: number
        slug: string
      }>({
        dataEntity: COURSE_ENTITY,
        fields: ['count', 'id', 'slug'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        schema: 'v1',
        where: `slug=${slug}`
      })
      console.log('SAVED PRODUCTS', saveProduct)

      const res = await ctx.clients.masterdata.createOrUpdateEntireDocument({
        dataEntity: COURSE_ENTITY,
        fields: {
          count: liveUsers,
          slug
        },
        id: saveProduct?.id
      })
      console.log('RES', res)
      return res

    } catch (error) {
      console.log(`failed to update product ${slug}`)
      console.log(error)
      return error
    }
  }))
  return true
}