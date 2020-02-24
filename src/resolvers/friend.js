import { findUserByIdService } from 'services/user'

export default {
	Friend: {
		user: ({ user }) => findUserByIdService(user)
	}
}
