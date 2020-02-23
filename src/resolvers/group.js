import Role from 'models/role'
import User from 'models/user'
import {
  getGroupService,
  getMyGroupsService,
  createGroupService,
  updateGroupService,
  deleteGroupService
} from 'services/group'

const getGroup = (_, args) => getGroupService(args)

const getMyGroups = (_, args, ctx) => getMyGroupsService(ctx)

const createGroup = (_, args, ctx) => createGroupService(args, ctx)

const updateGroup = (_, args) => updateGroupService(args)

const deleteGroup = (_, args) => deleteGroupService(args)

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
    owner: group => User.findById(group.owner),
    roles: group =>
      Promise.all(group.roles.map(roleId => Role.findById(roleId)))
  },
  Member: {
    __resolveType(member) {},
    member: ({ member }) => User.findById(member),
    roles: ({ roles }) => roles.map(role => Role.findById(role))
  }
}
