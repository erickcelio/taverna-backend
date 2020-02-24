import { addFriendOnUserRepository } from 'repository/user'
import { findTextChannelByIdService } from './text-channel'
import { findUserByIdService } from './user'

export const createFriendBetweenUsersService = async (
	firstUserId,
	secondUserId,
	textChannelId
) =>
	Promise.all([
		addFriendOnUserRepository(firstUserId, secondUserId, textChannelId),
		addFriendOnUserRepository(secondUserId, firstUserId, textChannelId)
	])

export const resolveFriendsService = async friends =>
	Promise.all(
		friends.map(async ({ user, textChannel }) => ({
			user: await findUserByIdService(user),
			textChannel: await findTextChannelByIdService(textChannel)
		}))
	)
