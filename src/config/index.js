import { merge } from 'lodash'
import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const DEFAULT_PORT = 3003
const DEFAULT_JWT_EXP = '100d'

const isDev = env === 'development' || env === 'dev'
const isTest = env === 'testing' || env === 'test'

const baseConfig = {
  apiKey: process.env.API_KEY,
  env,
  isDev,
  isTest,
  port: process.env.PORT || DEFAULT_PORT,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXP || DEFAULT_JWT_EXP
  }
}

const getCurrentConfig = env => {
  let configPath = ''

  switch (env) {
    case 'dev':
    case 'development':
      configPath = './dev'
      break
    case 'test':
    case 'testing':
      configPath = './testing'
      break
    default:
      configPath = '/dev'
  }

  const config = require(configPath)

  return config.default
}

export default merge(baseConfig, getCurrentConfig(env))
