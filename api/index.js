const { middleware, constantProxy, getChatId } = require('./tgUtils')
const { redisClient, redisKeyProxy } = require('./redisUtils')
const get = require('lodash.get')

const { SET_LANG_ENG, SET_LANG_ESP } = constantProxy
const { CHAT, LANG } = redisKeyProxy

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

module.exports = app

app.use(bodyParser.json())
app.use((req, res, next) => {
  req.redis = redisClient
  req.chatId = getChatId(req)
  next()
})

app.post('*', (req, res) => {
  if (req.body === null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }

  middleware(req, res)(async dispatcher => {
    const chatId = req.chatId
    if (!chatId) return
    const cb_data = get(req, 'body.callback_query.data')
    if (cb_data) {
      if (cb_data === SET_LANG_ENG || SET_LANG_ESP) {
        await req.redis.set(LANG(chatId), cb_data)
        dispatcher({ text: 'Lang set' })
      } else {
        dispatcher({ text: 'Oops. That button did nothing.' })
      }
      return
    }
    const exists = await req.redis.exists(CHAT(chatId))
    if (exists === 0) {
      const lang = await req.redis.get(LANG(chatId))
      if (!lang) {
        dispatcher({
          text: `*Welcome / Bienvenido*\n\n- This bot will match you with other person anonimously, please select a language to start.\n\n- Este es un bot que te emparejará con alguien para platicar anonimamente, por favor selecciona un idioma para empezar.`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: 'English', callback_data: SET_LANG_ENG }],
              [{ text: 'Español', callback_data: SET_LANG_ESP }],
            ],
          },
        })
      } else {
        dispatcher({
          text: `Nice`,
        })
        dispatcher({
          text: `Nice x2`,
        })
      }
    }
  })
})

app.all('*', (req, res) => {
  res.end('Ok')
})
