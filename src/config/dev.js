export const config = {
  secrets: {
    jwt: process.env.API_KEY_DEV || 'taverna-dev-secret'
  },
  dbUrl:
    process.env.MONGO_DB_URL_DEV || 'mongodb://localhost:27017/taverna-db-dev'
}
