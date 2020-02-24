import { addFriendOnUserRepository } from 'repository/user'
import { findUserByIdService } from './user'

export const createFriendBetweenUsersService = async (
	firstUserId,
	secondUserId
) =>
	Promise.all([
		addFriendOnUserRepository(firstUserId, secondUserId),
		addFriendOnUserRepository(secondUserId, firstUserId)
	])

export const resolveFriendsService = async friends =>
	Promise.all(
		friends.map(async friend => ({
			user: await findUserByIdService(friend.user)
		}))
	)
