import config from 'config'
import mongoose from 'mongoose'

export const connect = (url = config.dbUrl, opts = {}) =>
	mongoose.connect(url, { ...opts, useNewUrlParser: true })
