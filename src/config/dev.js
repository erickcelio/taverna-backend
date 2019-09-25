export const config = {
  secrets: {
    jwt: process.env.API_KEY_DEV || 'taverna-dev-secret'
  },
  dbUrl: 'mongodb://localhost:27017/taverna-db-dev'
}
