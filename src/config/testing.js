export const config = {
  secrets: {
    jwt: process.env.API_KEY_TEST || 'taverna-test-secret'
  },
  dbUrl: 'mongodb://localhost:27017/taverna-db-test'
}
