import FriendRequest from 'models/friend-request'

export const createFriendRequestRepository = (senderId, receiverId) =>
	FriendRequest.create({
		sender: senderId,
		receiver: receiverId
	})

export const changeFriendRequestStatusRepository = (id, status) =>
	FriendRequest.findByIdAndUpdate(id, { status }, { new: true })

export const getFriendRequestRepository = id => FriendRequest.findById(id)

export const getFriendRequestsRepository = senderId =>
	FriendRequest.find({ sender: senderId })
