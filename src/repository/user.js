import User from 'models/user'

export const findUserByIdRepository = id => User.findById(id)

export const updateUserRepository = (id, args) =>
	User.findByIdAndUpdate(id, args, { new: true })
		.select('-password')
		.lean()
		.exec()

export const findUserByEmailOrUsernameRepository = ({ email, username }) =>
	User.find().findByEmailOrUsername({ email, username })

export const createUserRepository = args =>
	User.create({ ...args }).then(user => user.toObject())

export const addFriendOnUserRepository = (userId, friend) =>
	User.findByIdAndUpdate(userId, {
		$push: {
			friends: {
				user: friend
			}
		}
	})
