import { execute, subscribe } from 'graphql'

import { ApolloServer } from 'apollo-server'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { authenticate } from 'utils/auth'
import config from './config'
import { connect } from './db'
import { createServer } from 'http'
import { loadResolver } from 'utils/resolver'
import { loadTypeSchema } from 'utils/schema'
import schemaDirectives from 'types/directives'

const types = [
	'directives',
	'user',
	'role',
	'group',
	'text-channel',
	'friend',
	'friend-request'
]

export const start = async () => {
	const typeDefs = await Promise.all(types.map(loadTypeSchema))
	const resolvers = await Promise.all(types.map(loadResolver))

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		schemaDirectives,
		introspection: true,
		playground: true,
		context: async ({ req, connection }) => {
			if (connection) {
				return {
					...connection.context
				}
			} else {
				return { user: await authenticate(req) }
			}
		}
	})

	const ws = createServer(server)

	ws.listen(3004, () => {
		console.log(`GraphQL WS Server is now running on http://localhost:3004`)
		return new SubscriptionServer(
			{
				execute,
				subscribe,
				schema: typeDefs
			},
			{
				server: ws,
				path: '/subscriptions'
			}
		)
	})

	await connect(config.dbUrl)

	const { url } = await server.listen({ port: config.port })

	console.log(`Taverna GraphQL server ready at ${url}`)
}
