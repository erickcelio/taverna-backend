import { Schema, Types, model } from 'mongoose'

import { FRIEND_REQUEST_STATUS } from 'utils/constants'

const friendRequestSchema = new Schema(
	{
		sender: {
			type: Types.ObjectId,
			ref: 'User'
		},
		receiver: {
			type: Types.ObjectId,
			ref: 'User'
		},
		status: {
			type: String,
			default: FRIEND_REQUEST_STATUS.PENDENT
		}
	},
	{ timestamps: true }
)

export default model('FriendRequest', friendRequestSchema)
