import { buildSchema } from 'graphql'
import { loadTypeSchema } from '../../../utils/schema'
import { schemaToTemplateContext } from 'graphql-codegen-core'

describe('Role schema', () => {
  let schema, typeDefs
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }

    `
    const typeSchemas = await Promise.all(
      ['role', 'user', 'group'].map(loadTypeSchema)
    )
    typeDefs = root + typeSchemas.join(' ')
    schema = schemaToTemplateContext(buildSchema(typeDefs))
  })
  describe('roleType:', () => {
    test('Role has base fields', () => {
      let type = schema.types.find(t => {
        return t.name === 'Role'
      })

      expect(type).toBeTruthy()

      const baseFields = {
        _id: 'ID!',
        isAdmin: 'Boolean',
        canManageServer: 'Boolean',
        canManegeRoles: 'Boolean',
        canManageRoles: 'Boolean',
        canManageChannels: 'Boolean',
        canKickMember: 'Boolean',
        canBanMembers: 'Boolean',
        canChangeNickname: 'Boolean',
        canReadTextChannels: 'Boolean',
        canSendMessages: 'Boolean',
        canManageMessages: 'Boolean'
      }

      type.fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
    })
  })
})
