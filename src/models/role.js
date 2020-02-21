import { Schema, model } from 'mongoose'

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    canManageServer: {
      type: Boolean,
      default: false
    },
    canManegeRoles: {
      type: Boolean,
      default: false
    },
    canManageRoles: {
      type: Boolean,
      default: false
    },
    canManageChannels: {
      type: Boolean,
      default: false
    },
    canKickMember: {
      type: Boolean,
      default: false
    },
    canBanMembers: {
      type: Boolean,
      default: false
    },
    canChangeNickname: {
      type: Boolean,
      default: true
    },
    canReadTextChannels: {
      type: Boolean,
      default: true
    },
    canSendMessages: {
      type: Boolean,
      default: true
    },
    canManageMessages: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default model('Role', roleSchema)
