import {
	changeFriendRequestStatusRepository,
	createFriendRequestRepository,
	getFriendRequestRepository,
	getFriendRequestsRepository
} from 'repository/friend-request'

import { FRIEND_REQUEST_STATUS } from 'utils/constants'
import { createFriendBetweenUsersService } from './friend'
import { createTextChannelService } from './text-channel'
import { findUserByEmailOrUsernameService } from './user'

export const getFriendRequestsService = senderId =>
	getFriendRequestsRepository(senderId)

export const sendFriendRequestService = async (senderId, receiverUsername) => {
	const { _id: receiverId } = await findUserByEmailOrUsernameService({
		username: receiverUsername
	})

	return createFriendRequestRepository(senderId, receiverId)
}

export const acceptFriendRequestService = async (userId, id) => {
	const friendRequest = await getFriendRequestRepository(id)

	if (friendRequest.receiver !== userId) {
		throw new Error('cannot_accept_this_friend_request')
	}

	const updatedFriendRequest = await changeFriendRequestStatusRepository(
		id,
		FRIEND_REQUEST_STATUS.ACCEPTED
	)

	const textChannel = await createTextChannelService('Chat')

	await createFriendBetweenUsersService(
		friendRequest.sender,
		friendRequest.receiver,
		textChannel._id
	)

	return updatedFriendRequest
}
