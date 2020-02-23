import {
  createUserRepository,
  findUserByEmailOrUsernameRepository,
  findUserByIdRepository,
  updateUserRepository
} from 'repository/user'

import { generateToken } from 'utils/auth'

export const findUserByIdService = id => findUserByIdRepository(id)

export const updateUserService = (id, args) => updateUserRepository(id, args)

export const findUserByEmailOrUsernameService = args =>
  findUserByEmailOrUsernameRepository(args)

export const createUserService = async args => {
  if (await findUserByEmailOrUsernameService(args)) {
    throw new Error('user_already_exists')
  }

  return createUserRepository(args)
}

export const signInService = async args => {
  const user = await findUserByEmailOrUsernameService(args)

  if (!user) {
    throw new Error('user_not_found')
  }

  if (!(await user.checkPassword(args.password))) {
    throw new Error('invalid_password')
  }

  return {
    user,
    token: generateToken({ id: user.id })
  }
}
