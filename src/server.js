import { ApolloServer } from 'apollo-server'
import { authenticate } from './utils/auth'
import config from './config'
import { connect } from './db'
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
    playground: true,
    async context({ req }) {
      const user = await authenticate(req)
      return { user }
    }
  })

  console.log('here 1')
  await connect(config.dbUrl)
  console.log('here 2')
  const { url } = await server.listen({ port: config.port })

  console.log(`Taverna GraphQL server ready at ${url}`)
}
