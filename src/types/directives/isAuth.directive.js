import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver } from 'graphql'
import { verifyAuthentication } from '../../utils/auth'

class isAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function(...args) {
      const [, , context] = args
      verifyAuthentication(context)
      return resolve.apply(this, args)
    }
  }
}

export default isAuthDirective
