import { buildSchema } from 'graphql'
import config from '../../../config'
import { loadTypeSchema } from '../../../utils/schema'
import { mockServer } from 'graphql-tools'
import { schemaToTemplateContext } from 'graphql-codegen-core'

describe('User schema', () => {
  let schema, typeDefs
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }

    `
    const typeSchemas = await Promise.all(config.types.map(loadTypeSchema))
    typeDefs = root + typeSchemas.join(' ')
    schema = schemaToTemplateContext(buildSchema(typeDefs))
  })
  describe('userType:', () => {
    test('User has base fields', () => {
      let type = schema.types.find(t => {
        return t.name === 'User'
      })

      expect(type).toBeTruthy()

      const baseFields = {
        _id: 'ID!',
        name: 'String!',
        email: 'String!',
        avatar: 'String',
        username: 'String!',
        groups: '[Group]'
      }

      type.fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
    })
    test('SignInOutput has base fields', () => {
      let type = schema.types.find(t => {
        return t.name === 'SignInOutput'
      })

      expect(type).toBeTruthy()

      const baseFields = {
        user: 'User!',
        token: 'String!'
      }

      type.fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('SignInInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'SignInInput')

      expect(input).toBeTruthy()

      const fields = {
        username: 'String!',
        password: 'String!'
      }

      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('NewUserInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'NewUserInput')

      expect(input).toBeTruthy()

      const fields = {
        name: 'String!',
        username: 'String!',
        email: 'String!',
        password: 'String!'
      }
      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('UpdateUserInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'UpdateUserInput')

      expect(input).toBeTruthy()

      const fields = {
        name: 'String',
        avatar: 'String'
      }

      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    it('me query', async () => {
      const server = mockServer(typeDefs)
      const query = `
        {
          me {
            name
            avatar
            username
            email
          }
        }
      `
      await expect(server.query(query)).resolves.toBeTruthy()
      const { errors } = await server.query(query)
      expect(errors).not.toBeTruthy()
    })

    it('signIn query', async () => {
      const server = mockServer(typeDefs)
      const query = `
        {
          signIn {
            token
            user {
              name
              avatar
              username
              email
            }
          }
        }
      `
      await expect(server.query(query)).resolves.toBeTruthy()
      const { errors } = await server.query(query)
      expect(errors).not.toBeTruthy()
    })

    it('signUp mutation', async () => {
      const server = mockServer(typeDefs)
      const query = `
        mutation CreateNewUser($input: NewUserInput!) {
          signUp(input: $input) {
            name
            avatar,
            email,
            username
          }
        }
      `
      const vars = {
        input: {
          name: 'Joao',
          email: 'joao@email.com',
          username: 'joaoteste',
          password: '123456'
        }
      }
      await expect(server.query(query, vars)).resolves.toBeTruthy()
      const { errors } = await server.query(query, vars)
      expect(errors).not.toBeTruthy()
    })

    it('updateMe mutation', async () => {
      const server = mockServer(typeDefs)
      const query = `
        mutation UpdateUser($input: UpdateUserInput!) {
          updateMe(input: $input) {
            name
            avatar
            email
            username
          }
        }
      `
      const vars = {
        input: {
          name: 'Joao',
          avatar: 'avatar'
        }
      }
      await expect(server.query(query, vars)).resolves.toBeTruthy()
      const { errors } = await server.query(query, vars)
      expect(errors).not.toBeTruthy()
    })
  })
})
