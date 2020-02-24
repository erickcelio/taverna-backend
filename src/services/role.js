import {
	findRoleByIdRepository,
	findRolesByIdsRepository
} from 'repository/role'

export const findRoleByIdService = id => findRoleByIdRepository(id)

export const findRolesByIdsService = ids => findRolesByIdsRepository(ids)
