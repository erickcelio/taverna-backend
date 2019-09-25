import { User } from '../types/user/user.model'
import config from '../config'
import cuid from 'cuid'
import jwt from 'jsonwebtoken'

export const newApiKey = () => {
  return cuid()
}

export const generateToken = params =>
  jwt.sign({ ...params }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })

export const authenticate = async req => {
  const token = req.headers.authorization

  if (!token) {
    return
  }

  return jwt.verify(token, process.env.API_KEY, async (err, decoded) => {
    if (err) {
      throw new Error('invalid_token')
    }

    const user = await User.findById(decoded.id)
      .select('-password')
      .lean()
      .exec()

    return user
  })
}
