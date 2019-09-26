import { AuthenticationError } from 'apollo-server'
import Group from './group.model'

const getGroup = (_, args) =>
  Group.findById(args.id)
    .populate('roles')
    .populate('owner')
    .populate('members.member', ['name', 'avatar'])

const getMyGroups = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Group.find()
    .findByOwner(ctx.user._id)
    .populate('roles')
    .populate('members.member', ['name', 'avatar'])
}

const createGroup = async (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Group.create({ ...args.input, owner: ctx.user._id })
}

const updateGroup = () => {}

const deleteGroup = () => {}

export default {
  Query: {
    getGroup,
    getMyGroups
  },
  Mutation: {
    createGroup,
    updateGroup,
    deleteGroup
  }
}
