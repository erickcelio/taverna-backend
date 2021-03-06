import { AuthenticationError } from 'apollo-server'
import User from 'models/user'
import config from 'config'
import { isEmpty } from 'lodash'
import jwt from 'jsonwebtoken'

export const generateToken = params =>
	jwt.sign({ ...params }, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp
	})

export const verifyAuthentication = ctx => {
	if (isEmpty(ctx.user)) {
		throw new AuthenticationError('unauthenticated')
	}
}

export const authenticate = async req => {
	const token = req.headers.authorization

	if (!token) {
		return
	}

	return jwt.verify(token, config.secrets.jwt, async (err, decoded) => {
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
