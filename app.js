const express = require('express')
const path = require('path')
const db = require('./data/connect')
const Client = require('./data/client')
const Telegraf = require('telegraf')

const app = express()
const { reply } = Telegraf
const bot = new Telegraf(process.env.tlg_token)

// Connect to MongoDB
db.connect((error) => {
  if (error) {
    console.log('Failed to connect to database')
  } else {
    console.log('Database connected')
  }
})

// Telegram: send chatid to user
bot.command('/start', (ctx) => {
  ctx
    .reply(`Here is your key ${ctx.message.chat.id}`)
    .catch(error => console.log(error))
})

// Express: proccess client message request
app.get('/message/:key/:target/:message', (req, res) => {
  Client
    .get(req.params.key)
  // If client key is valid send message to user
    .then((client) => {
      return bot.telegram
        .sendMessage(
          req.params.target, 
          `${req.params.message} \n\nFrom ${client.name}`,
        )
    })
  // If message sent increment client message counter
    .then((msg) => {
      return Client
        .incr(req.params.key)
    })
  // If couter updated send response code 200
    .then((client) => {
      res.sendStatus(200)
    })
  // If error occured send response code 500
    .catch((error) => {
      console.log(error)
      res.sendStatus(500)
    })
})

// Express: proccess client registration
app.post('/client/new', (req, res) => {
  Client
    .add(
      {
        email: req.body.email,
        name: req.body.name,
        tel: req.body.tel,
      },
    )
    .then((client) => {
      console.log(`Added: ${client}`)
      res.sendStatus(200)
    })
    .catch((error) => {
      console.log(`Failed to add ${req.params.name}`)
      res.sendStatus(500)
    })
})

// Express: show all clients
app.get('/client/all/:admkey', (req, res) => {
  if (req.params.admkey !== process.env.adm_key){
    res.sendStatus(500)
    return
  }

  Client
    .getAll()
    .then((clients) => {
      res.send(JSON.stringify(clients))
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(500)
    })
});

// Express: index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
})

// Start Telegram and Express
bot.startPolling()
app.listen((process.env.PORT || 5000))
