import { PubSub, withFilter } from 'graphql-subscriptions'

import { findUserByIdService } from 'services/user'
import { sendMessageOnTextChannelService } from 'services/text-channel'

const pubSub = new PubSub()

const sendMessage = (_, args, ctx) =>
	sendMessageOnTextChannelService(ctx.user._id, args.input).then(message => {
		pubSub.publish('sendedMessage', {
			sendedMessage: { ...message, ...args.input }
		})
		return message
	})

export default {
	Mutation: {
		sendMessage
	},
	Message: {
		sender: ({ sender }) => findUserByIdService(sender)
	},
	Subscription: {
		sendedMessage: {
			subscribe: withFilter(
				() => pubSub.asyncIterator('sendedMessage'),
				(payload, variables) =>
					variables.channelsIds.some(
						channelId => channelId === payload.sendedMessage.textChannelId
					)
			)
		}
	}
}
