import { AuthenticationError } from 'apollo-server'
import Group from './group.model'
import Role from '../role/role.model'
import User from '../user/user.model'

const getGroup = (_, args) =>
  Group.findById(args.id)
    .populate('roles')
    .populate('members.member', ['name', 'avatar'])

const getMyGroups = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Group.find().findByOwner(ctx.user._id)
}

const createGroup = async (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Group.create({ ...args.input, owner: ctx.user._id })
}

const updateGroup = async (_, args) => {
  const {
    input: { _id, name, image }
  } = args

  return Group.findByIdAndUpdate(_id, { name, image })
}

const deleteGroup = async (_, args) => Group.findByIdAndDelete(args._id)

export default {
  Query: {
    getGroup,
    getMyGroups
  },
  Mutation: {
    createGroup,
    updateGroup,
    deleteGroup
  },
  Group: {
    __resolveType(group) {},
    owner(group) {
      return User.findById(group.owner)
    },
    roles(group) {
      return Promise.all(group.roles.map(roleId => Role.findById(roleId)))
    }
  },
  Member: {
    __resolveType(member) {},
    member: ({ member }) => User.findById(member),
    roles: ({ roles }) => roles.map(role => Role.findById(role))
  }
}
