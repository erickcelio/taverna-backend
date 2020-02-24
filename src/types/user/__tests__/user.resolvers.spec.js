import User from 'models/user'
import userResolvers from 'resolvers/user'

const defaultUser = {
	name: 'João',
	username: 'joaodoteste',
	email: 'joao@email.com',
	password: '123456'
}

describe('userResolvers:', () => {
	describe('Resolving Queries:', () => {
		describe('signIn Resolver', async () => {
			test('it made signIn with email and return token and user', async () => {
				await User.create(defaultUser)
				const result = await userResolvers.Query.signIn(
					null,
					{
						input: {
							username: defaultUser.email,
							password: defaultUser.password
						}
					},
					{ user: {} }
				)
				expect(result).toHaveProperty('token')
				expect(result).toHaveProperty('user')
			})

			test('it made signIn with username and return token and user', async () => {
				await User.create(defaultUser)
				const result = await userResolvers.Query.signIn(
					null,
					{
						input: {
							username: defaultUser.username,
							password: defaultUser.password
						}
					},
					{ user: {} }
				)
				expect(result).toHaveProperty('token')
				expect(result).toHaveProperty('user')
			})

			test('it cant made signIn because user is incorrect', async () => {
				await User.create(defaultUser)
				try {
					await userResolvers.Query.signIn(
						null,
						{
							input: {
								username: 'joaoteste',
								password: 'passwordincorrect'
							}
						},
						{ user: {} }
					)
				} catch (e) {
					expect(e.message).toBe('user_not_found')
				}
			})

			test('it cant made signIn because password is incorrect', async () => {
				await User.create(defaultUser)
				try {
					await userResolvers.Query.signIn(
						null,
						{
							input: {
								username: defaultUser.username,
								password: 'teste'
							}
						},
						{ user: {} }
					)
				} catch (e) {
					expect(e.message).toBe('invalid_password')
				}
			})
		})

		describe('me Resolver', async () => {
			test('it made signIn with email and return token and user', async () => {
				let user = null
				user = await User.create(defaultUser)
				user = user.toObject()
				Reflect.deleteProperty(user, 'password')
				const result = await userResolvers.Query.me(
					null,
					{
						input: {
							username: defaultUser.email,
							password: defaultUser.password
						}
					},
					{ user }
				)
				expect(result.toObject()).toMatchObject(user)
			})
		})
	})

	describe('Resolving Mutations:', () => {
		describe('signUp Resolver', () => {
			test('it create user and return properties', async () => {
				const result = await userResolvers.Mutation.signUp(null, {
					input: defaultUser
				})
				expect(result).toHaveProperty('_id')
				expect(result).toHaveProperty('name')
				expect(result).toHaveProperty('email')
				expect(result).toHaveProperty('username')
				expect(result).not.toHaveProperty('avatar')
			})

			test('it return error because have already registered email or password', async () => {
				await User.create(defaultUser)
				try {
					await userResolvers.Mutation.signUp(null, {
						input: defaultUser
					})
				} catch (e) {
					expect(e.message).toBe('user_already_exists')
				}
			})
		})

		describe('updateMe Resolver', () => {
			test('it update user and return properties', async () => {
				const user = await User.create(defaultUser)
				const updateAtributes = {
					name: 'maria',
					avatar: 'avatarUpdated'
				}
				const result = await userResolvers.Mutation.updateMe(
					null,
					{
						input: {
							...updateAtributes
						}
					},
					{ user }
				)
				expect(result).toHaveProperty('avatar', updateAtributes.avatar)
				expect(result).toHaveProperty('name', updateAtributes.name)
			})
		})
	})
})
