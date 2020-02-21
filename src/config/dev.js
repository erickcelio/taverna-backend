export default {
  dbUrl:
    process.env.MONGO_DB_URL_DEV || 'mongodb://localhost:27017/taverna-db-dev'
}
