const express = require('express')
const Telegraf = require('telegraf')

const { reply } = Telegraf
const app = express()
const bot = new Telegraf(process.env.tlg_token)

bot.command('/start', (ctx) => {
  ctx.reply(`Here is your key ${ ctx.message.chat.id }`)
})

app.get('/api/:key/:target/:message', (req, res) => {
  if (req.params.key == 'ag5d4h5sd45hfreferahgrfsdg45')
    bot.telegram.sendMessage(req.params.target, req.params.message)
  res.send()
})

module.exports.startBot = bot.startPolling
module.exports.startExpress = () => app.listen(process.env.PORT)