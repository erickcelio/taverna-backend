import { merge } from 'lodash'
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: process.env.PORT || 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  }
}

let envConfigStagePath = ''

switch (env) {
  case 'dev':
  case 'development':
    envConfigStagePath = './dev'
    break
  case 'test':
  case 'testing':
    envConfigStagePath = './testing'
    break
  default:
    envConfigStagePath = './dev'
}

const { config } = require(envConfigStagePath)

export default merge(baseConfig, config)
