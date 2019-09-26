import { buildSchema } from 'graphql'
import { loadTypeSchema } from '../../../utils/schema'
import { mockServer } from 'graphql-tools'
import { schemaToTemplateContext } from 'graphql-codegen-core'

describe('Group schema', () => {
  let schema, typeDefs
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }

    `
    const typeSchemas = await Promise.all(
      ['group', 'user', 'role'].map(loadTypeSchema)
    )
    typeDefs = root + typeSchemas.join(' ')
    schema = schemaToTemplateContext(buildSchema(typeDefs))
  })
  describe('groupType:', () => {
    test('Group has base fields', () => {
      let type = schema.types.find(t => {
        return t.name === 'Group'
      })

      expect(type).toBeTruthy()

      const baseFields = {
        _id: 'ID!',
        name: 'String!',
        image: 'String',
        owner: 'User!',
        roles: '[Role]',
        members: '[Member]'
      }

      type.fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('Member has base fields', () => {
      let type = schema.types.find(t => {
        return t.name === 'Member'
      })

      expect(type).toBeTruthy()

      const baseFields = {
        _id: 'ID!',
        member: 'User!',
        roles: '[Role]'
      }

      type.fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('newGroupInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'NewGroupInput')

      expect(input).toBeTruthy()

      const fields = {
        name: 'String!',
        image: 'String'
      }

      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('UpdateGroupInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'UpdateGroupInput')

      expect(input).toBeTruthy()

      const fields = {
        name: 'String',
        image: 'String'
      }

      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    it('getGroup query', async () => {
      const server = mockServer(typeDefs)
      const query = `
        {
          getGroup(id: "384hsd") {
            name
            image
            owner {
              name,
              avatar
            }
            roles {
              _id
            }
            members {
              member {
                name
              }
              roles {
                _id
              }
            }
          }
        }
      `
      await expect(server.query(query)).resolves.toBeTruthy()
      const { errors } = await server.query(query)
      expect(errors).not.toBeTruthy()
    })

    it('getMyGroups query', async () => {
      const server = mockServer(typeDefs)
      const query = `
        {
          getMyGroups {
            name
            image
            owner {
              name,
              avatar
            }
            roles {
              _id
            }
            members {
              member {
                name
              }
              roles {
                _id
              }
            }
          }
        }
      `
      await expect(server.query(query)).resolves.toBeTruthy()
      const { errors } = await server.query(query)
      expect(errors).not.toBeTruthy()
    })

    it('CreateNewGroup mutation', async () => {
      const server = mockServer(typeDefs)
      const query = `
        mutation CreateNewGroup($input: NewGroupInput!) {
          createGroup(input: $input) {
            name
            image
            owner {
              name
              avatar
            }
          }
        }
      `
      const vars = {
        input: {
          name: 'JS Group',
          image: 'https://image.com'
        }
      }
      await expect(server.query(query, vars)).resolves.toBeTruthy()
      const { errors } = await server.query(query, vars)
      expect(errors).not.toBeTruthy()
    })

    it('UpdateGroup mutation', async () => {
      const server = mockServer(typeDefs)
      const query = `
        mutation UpdateGroup($input: UpdateGroupInput!) {
          updateGroup(input: $input) {
            name
            image
            owner {
              _id
              name
              avatar
            }
            roles {
              _id
            }
            members {
              member {
                name
              }
              roles {
                _id
              }
            }
          }
        }
      `
      const vars = {
        input: {
          name: 'JS2 Group',
          image: 'https://image2.com'
        }
      }
      await expect(server.query(query, vars)).resolves.toBeTruthy()
      const { errors } = await server.query(query, vars)
      expect(errors).not.toBeTruthy()
    })

    it('DeleteGroup mutation', async () => {
      const server = mockServer(typeDefs)
      const query = `
        mutation DeleteGroup {
          deleteGroup(id: "d1e4asd") {
            _id
            name
            image
          }
        }
      `
      const vars = {
        input: {
          name: 'JS2 Group',
          image: 'https://image2.com'
        }
      }
      await expect(server.query(query, vars)).resolves.toBeTruthy()
      const { errors } = await server.query(query, vars)
      expect(errors).not.toBeTruthy()
    })
  })
})
