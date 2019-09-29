import Group from './../types/group/group.model'
import Roles from './../types/role/role.model'

const verifyUserRoleInGroup = async ({ groupId, roles, user }) => {
  const group = await Group.findById(groupId)
  const member = group.members.find(({ member }) => member.equals(user._id))
  const groupRoles = await Roles.find({ _id: { $in: member.roles } })
  const hasRole = groupRoles.find(groupRole => {
    return roles.find(role => groupRole[role])
  })

  return Boolean(hasRole)
}

export { verifyUserRoleInGroup }
