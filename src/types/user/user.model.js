import { Schema, model } from 'mongoose'

import bcrypt from 'bcrypt'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password
  return new Promise(resolve => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        throw new Error('invalid_password')
      }
      resolve(same)
    })
  })
}

userSchema.query.findByEmailOrUsername = function({ email, username }) {
  return this.findOne({
    $or: [{ email }, { username }]
  }).select('+password')
}

export default model('User', userSchema)
