import {
  createGroupRepository,
  deleteGroupRepository,
  getGroupByIdRepository,
  getGroupsInIdsRepository,
  updateGroupRepository
} from 'repository/group'

import Group from 'models/group'
import Roles from 'models/role'

export const getGroupByIdService = id => getGroupByIdRepository(id)

export const getGroupsByIdsService = ids => getGroupsInIdsRepository(ids)

export const createGroupService = args => createGroupRepository(args)

export const updateGroupService = ({ groupId, ...args }) =>
  updateGroupRepository(groupId, args)

export const deleteGroupService = ({ groupId }) =>
  deleteGroupRepository(groupId)

export const verifyUserRoleInGroup = async ({ groupId, roles, user }) => {
  const group = await Group.findById(groupId)
  const member = group.members.find(({ member }) => member.equals(user._id))
  const groupRoles = await Roles.find({ _id: { $in: member.roles } })
  const hasRole = groupRoles.find(groupRole => {
    return roles.find(role => groupRole[role])
  })

  return Boolean(hasRole)
}
