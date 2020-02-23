import Group from 'models/group'
import User from 'models/user'
import { generateToken } from 'utils/auth'

const me = (_, args, ctx) => User.findById(ctx.user._id)

const updateMe = (_, args, ctx) =>
  User.findByIdAndUpdate(ctx.user._id, args.input, { new: true })
    .select('-password')
    .lean()
    .exec()

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

  if (!(await user.checkPassword(password))) {
    throw new Error('invalid_password')
  }

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
  },
  User: {
    __resolveType(member) {},
    groups: ({ groups }) => groups.map(groupId => Group.findById(groupId))
  }
}
