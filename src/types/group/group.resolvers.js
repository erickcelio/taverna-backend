import Group from './group.model'
import Role from '../role/role.model'
import User from '../user/user.model'

const getGroup = (_, args) => Group.findById(args.groupId)

const getMyGroups = (_, args, ctx) =>
  Group.find({ _id: { $in: ctx.user.groups } })

const createGroup = async (_, args, ctx) =>
  Group.create({ ...args.input, owner: ctx.user._id })

const updateGroup = async (_, args) => {
  const {
    input: { groupId, name, image }
  } = args

  return Group.findByIdAndUpdate(groupId, { name, image }, { new: true })
}

const deleteGroup = async (_, args) => Group.findByIdAndDelete(args.groupId)

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
