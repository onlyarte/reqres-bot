const db = require('./connect')
const ObjectID = require('mongodb').ObjectID

const get = function findById(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('Wrong id'))
      return
    }
    if (!db.get()) {
      reject(new Error('Could not connect to db!'))
      return
    }

    const Client = db.get().collection('client')

    return Client.findOne(
      {
        _id: new ObjectID(id),
      }, 
      (error, client) => {
        if (error) reject(error)
        if (!client) reject(new Error('Client with that id not found'))
        
        resolve(client)
      }
    )
  })
}

const add = function addNewClient(client) {
  return new Promise((resolve, reject) => {
    if (!client || !client.email || !client.name || !client.tel) {
      reject(new Error('You should provide email, name and phone number to get api key'))
      return
    }
    if (!db.get()) {
      reject(new Error('Could not connect to db!'))
      return
    }

    const Client = db.get().collection('client')

    return Client.insert(client, (error, res) => {
      if (eror) reject(error)
      resolve(res.result)
    })
  })
}

const incr = function findByIdAndIncrMessages(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('Wrong id'))
      return
    }
    if (!db.get()) {
      reject(new Error('Could not connect to db!'))
      return
    }

    const Client = db.get().collection('client')

    Client.findOneAndUpdate(
      {
        _id: new ObjectID(id),
      }, 
      {
        $inc: { messages: 1 },
      },
      (error, client) => {
        if (error) reject(error)
        if (!client) reject(new Error('Client with that id not found'))
        
        resolve(client)
      }
    )
  })
}

const reset = function findByIdAndResetMessagesCounter(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('Wrong id'))
      return
    }
    if (!db.get()) {
      reject(new Error('Could not connect to db!'))
      return
    }

    const Client = db.get().collection('client')

    Client.findOneAndUpdate(
      {
        _id: new ObjectID(id),
      }, 
      {
        $set: {
          messages: 0,
          resetedAt: new Date(),
        },
      },
      (error, client) => {
        if (error) reject(error)
        if (!client) reject(new Error('Client with that id not found'))
        
        resolve(client)
      }
    )
  })
}

module.exports.get = get
module.exports.add = add
module.exports.incr = incr
module.exports.reset = reset
