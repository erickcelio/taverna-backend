import { Schema, Types, model } from 'mongoose'

import Role from './role'
import TextChannel from './text-channel'
import User from './user'

const groupSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		image: {
			type: String
		},
		owner: {
			type: Types.ObjectId,
			ref: 'User',
			required: true
		},
		roles: [
			{
				type: Types.ObjectId,
				ref: 'Role'
			}
		],
		members: [
			{
				member: {
					type: Types.ObjectId,
					ref: 'User'
				},
				roles: [
					{
						type: Types.ObjectId,
						ref: 'Role'
					}
				]
			}
		],
		textChannels: [
			{
				type: Types.ObjectId,
				ref: 'TextChannel'
			}
		]
	},
	{ timestamps: true }
)

groupSchema.query.findByOwner = function(owner) {
	return this.find({ owner })
}

groupSchema.pre('save', async function(next) {
	const newRole = await Role.create({
		name: 'Admin',
		isAdmin: true,
		canManageServer: true,
		canManageRoles: true,
		canManageChannels: true,
		canKickMember: true,
		canBanMembers: true,
		canChangeNickname: true,
		canReadTextChannels: true,
		canSendMessages: true,
		canManageMessages: true
	})

	const textChannel = await TextChannel.create({
		name: 'Text Chat'
	})

	this.roles.push(newRole._id)
	this.textChannels.push(textChannel._id)

	this.members.push({
		member: this.owner,
		roles: [newRole._id]
	})

	next()
})

groupSchema.post('save', async function(group) {
	return User.findByIdAndUpdate(group.owner, {
		$push: { groups: group._id }
	})
})

groupSchema.pre('findByIdAndDelete', async function() {
	const deleteRoles = this.roles.map(role => Role.findByIdAndDelete(role))

	const removeGroupFromUser = this.members.map(async ({ member }) =>
		User.findByIdAndUpdate(member, { $pull: { groups: this._id } })
	)

	return Promise.all(...removeGroupFromUser, ...deleteRoles)
})

export default model('Group', groupSchema)
