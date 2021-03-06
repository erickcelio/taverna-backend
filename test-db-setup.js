import User from './src/models/user'
import config from './src/config'
import cuid from 'cuid'
import { map } from 'lodash'
import mongoose from 'mongoose'

const models = { User }

global.newId = () => {
	return mongoose.Types.ObjectId()
}

const remove = collection =>
	new Promise((resolve, reject) => {
		collection.remove(err => {
			if (err) return reject(err)
			resolve()
		})
	})

beforeEach(async done => {
	const db = cuid()

	const clearDB = () =>
		Promise.all(map(mongoose.connection.collections, c => remove(c)))

	if (mongoose.connection.readyState === 0) {
		try {
			await mongoose.connect(config.dbUrl + db, {
				useNewUrlParser: true,
				autoIndex: true
			})
			await clearDB()
			await Promise.all(Object.keys(models).map(name => models[name].init()))
		} catch (e) {
			console.log('connection error')
			console.error(e)
			throw e
		}
	} else {
		await clearDB()
	}
	done()
})

afterEach(async done => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.disconnect()
	return done()
})

afterAll(done => done())
