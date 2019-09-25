import { AuthenticationError } from 'apollo-server'
import User from './user.model'
import { generateToken } from '../../utils/auth'
import { isEmpty } from 'lodash'

const me = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return User.findById(ctx.user._id)
}

const updateMe = (_, args, ctx) => {
  if (isEmpty(ctx.user)) {
    throw new AuthenticationError()
  }

  return User.findByIdAndUpdate(ctx.user._id, args.input, { new: true })
    .select('-password')
    .lean()
    .exec()
}

const signUp = async (_, args) => {
  const { email, username } = args.input

  const user = await User.find().findByEmailOrUsername({ email, username })

  if (user) {
    throw new Error('user_already_exists')
  }

  let newUser = await User.create({ ...args.input })

  newUser = newUser.toObject()

  Reflect.deleteProperty(newUser, 'password')

  return newUser
}

const signIn = async (_, args) => {
  const { username, password } = args.input

  const user = await User.find().findByEmailOrUsername({
    username,
    email: username
  })

  if (!user) {
    throw new Error('user_not_found')
  }

  await user.checkPassword(password)

  user.password = undefined

  return {
    user,
    token: generateToken({ id: user.id })
  }
}

export default {
  Query: {
    me,
    signIn
  },
  Mutation: {
    updateMe,
    signUp
  }
}
