import { Schema, Types, model } from 'mongoose'

import Role from '../role/role.model'

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
    canManegeRoles: true,
    canManageRoles: true,
    canManageChannels: true,
    canKickMember: true,
    canBanMembers: true,
    canChangeNickname: true,
    canReadTextChannels: true,
    canSendMessages: true,
    canManageMessages: true
  })

  this.roles.push(newRole._id)

  this.members.push({
    member: this.owner,
    roles: [newRole._id]
  })

  next()
})

export default model('Group', groupSchema)
