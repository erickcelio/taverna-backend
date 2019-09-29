import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server'
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLList,
  GraphQLString,
  defaultFieldResolver
} from 'graphql'

import { verifyUserRoleInGroup } from '../../services/group.services'

class HasRoleInGroupDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: 'hasRoleInGroup',
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        roles: {
          type: new GraphQLList(GraphQLString)
        }
      }
    })
  }
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const roles = this.args.roles
    field.resolve = async function(...args) {
      const [
        ,
        {
          input: { groupId }
        },
        { user }
      ] = args
      if (await verifyUserRoleInGroup({ groupId, user, roles })) {
        return resolve.apply(this, args)
      } else {
        throw new AuthenticationError('you_dont_have_permission')
      }
    }
  }
}
export default HasRoleInGroupDirective
