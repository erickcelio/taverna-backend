import {
  createUserService,
  findUserByIdService,
  signInService,
  updateUserService
} from 'services/user'

import { getGroupsByIdsService } from 'services/group'

const me = (_, args, ctx) => findUserByIdService(ctx.user._id)

const updateMe = (_, args, ctx) => updateUserService(ctx.user._id, args.input)

const signUp = async (_, args) => createUserService(args.input)

const signIn = async (_, args) => signInService(args.input)

export default {
  Query: {
    me,
    signIn
  },
  Mutation: {
    updateMe,
    signUp
  },
  User: {
    groups: ({ groups }) => getGroupsByIdsService(groups)
  }
}
