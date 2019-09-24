import { ApolloServer } from 'apollo-server'
import { authenticate } from './utils/auth'
import config from './config'
import { loadResolver } from './utils/resolver'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'

const types = ['user']

export const start = async () => {
  const typeDefs = await Promise.all(types.map(loadTypeSchema))
  const resolvers = merge(await Promise.all(types.map(loadResolver)))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    async context({ req }) {
      const user = await authenticate(req)
      return { user }
    }
  })

  // await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`Taverna GraphQL server ready at ${url}`)
}