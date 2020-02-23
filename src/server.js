import { ApolloServer } from 'apollo-server'
import { authenticate } from 'utils/auth'
import config from './config'
import { connect } from './db'
import { loadResolver } from 'utils/resolver'
import { loadTypeSchema } from 'utils/schema'
import schemaDirectives from 'types/directives'

const types = ['directives', 'user', 'role', 'group']

export const start = async () => {
  const typeDefs = await Promise.all(types.map(loadTypeSchema))
  const resolvers = await Promise.all(types.map(loadResolver))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    introspection: true,
    playground: true,
    context: async ({ req }) => ({ user: await authenticate(req) })
  })

  await connect(config.dbUrl)

  const { url } = await server.listen({ port: config.port })

  console.log(`Taverna GraphQL server ready at ${url}`)
}
