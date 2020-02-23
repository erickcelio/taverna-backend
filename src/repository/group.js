import Group from 'models/group'

export const getGroupByIdRepository = id => Group.findById(id)

export const getGroupsInIdsRepository = ids => Group.find({ _id: { $in: ids } })

export const createGroupRepository = args => Group.create({ ...args })

export const updateGroupRepository = (id, args) =>
  Group.findByIdAndUpdate(id, { ...args }, { new: true })

export const deleteGroupRepository = id => Group.findByIdAndDelete(id)
