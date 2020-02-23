import Group from 'models/group'
import Roles from 'models/role'
import {
  getGroupByIdRepository,
  getGroupsInIdsRepository,
  createGroupRepository,
  updateGroupRepository,
  deleteGroupRepository
} from 'repository/group'

export const getGroupService = ({ groupId }) => getGroupByIdRepository(groupId)

export const getMyGroupsService = ({ user }) =>
  getGroupsInIdsRepository(user.groups)

export const createGroupService = ({ input }, { user }) =>
  createGroupRepository({ ...input, owner: user._id })

export const updateGroupService = ({ input: { groupId, ...args } }) =>
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
