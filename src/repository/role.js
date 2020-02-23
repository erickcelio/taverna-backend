import Role from 'models/role'

export const findRoleByIdRepository = id => Role.findById(id)

export const findRolesByIdsRepository = ids => Role.find({ _id: { $in: ids } })
