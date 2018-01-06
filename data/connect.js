const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = process.env.mdb_url

// Database Name
const dbName = 'birdsaidbot'
let db = null

// Connect to MongoDB
module.exports.connect = (callback) => {
  if (db) {
    callback(null)
    return
  }

  MongoClient.connect(url, (error, client) => {
    if (error) {
      callback(error)
      return
    }

    db = client.db(dbName)
    callback(null);
  })
}

module.exports.get = () => db
