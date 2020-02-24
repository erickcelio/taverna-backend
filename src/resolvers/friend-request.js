import {
	acceptFriendRequestService,
	getFriendRequestsService,
	sendFriendRequestService
} from 'services/friend-request'

import { findUserByIdService } from 'services/user'

const sendFriendRequest = (_, args, ctx) =>
	sendFriendRequestService(ctx.user._id, args.username)

const acceptFriendRequest = (_, args, ctx) =>
	acceptFriendRequestService(ctx.user._id, args.requestId)

const getFriendRequests = (_, args, ctx) =>
	getFriendRequestsService(ctx.user._id)

export default {
	Mutation: {
		sendFriendRequest,
		acceptFriendRequest
	},
	Query: {
		getFriendRequests
	},
	FriendRequest: {
		sender: ({ sender }) => findUserByIdService(sender),
		receiver: ({ receiver }) => findUserByIdService(receiver)
	}
}
