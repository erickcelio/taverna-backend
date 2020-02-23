import {
  createGroupService,
  deleteGroupService,
  getGroupByIdService,
  getGroupsByIdsService,
  updateGroupService
} from 'services/group'

import { findRolesByIdsService } from 'services/role'
import { findUserByIdService } from 'services/user'

const getGroup = (_, args) => getGroupByIdService(args.groupId)

const getMyGroups = (_, args, ctx) => getGroupsByIdsService(ctx.user.groups)

const createGroup = (_, args, ctx) =>
  createGroupService({ ...args.input, owner: ctx.user._id })

const updateGroup = (_, args) => updateGroupService(args.input)

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
    owner: ({ owner }) => findUserByIdService(owner),
    roles: ({ roles }) => findRolesByIdsService(roles)
  },
  Member: {
    __resolveType(member) {},
    member: ({ member }) => findUserByIdService(member),
    roles: ({ roles }) => findRolesByIdsService(roles)
  }
}
