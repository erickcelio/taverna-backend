import { Schema, Types, model } from 'mongoose'

const textChannelSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		messages: [
			{
				sender: {
					type: Types.ObjectId,
					ref: 'User',
					required: true
				},
				content: {
					type: String,
					required: true
				}
			}
		]
	},
	{ timestamps: true }
)

export default model('TextChannel', textChannelSchema)
