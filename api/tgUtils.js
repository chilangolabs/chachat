const { TELEGRAM_TOKEN } = process.env

const _fetch = require('node-fetch')
const get = require('lodash.get')

const url = method => `https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`

const body = obj => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(obj),
})

const response = ({ method = 'sendMessage', ...obj } = {}) =>
  JSON.stringify({ method, ...obj })

const middleware = (req, res) => async fn => {
  let state = []
  const dispatcher = action => (state = [...state, action])
  await fn(dispatcher)
  if (state.length === 0) {
    res.end()
  } else {
    const fixAction = ({ method = 'sendMessage', ...obj }) => {
      if (method === 'sendMessage') {
        if (!obj.chat_id) {
          return { ...obj, method, chat_id: getChatId(req) }
        }
      }
      return { method, obj }
    }
    const byFetch = action => {
      const { method = 'sendMessage', ...obj } = fixAction(action)
      return _fetch(url(method), body(obj))
    }
    const byResponse = action => response(fixAction(action))

    for (let action of state.slice(0, -1)) await byFetch(action)
    res.set('Content-Type', 'application/json')
    res.end(byResponse(...state.slice(-1)))
  }
}

const constantProxy = new Proxy(
  {},
  {
    get: (target, property) => property,
  }
)

const getChatId = req =>
  get(req, 'body.message.chat.id') ||
  get(req, 'body.callback_query.message.chat.id')

module.exports = {
  url,
  response,
  body,
  middleware,
  constantProxy,
  getChatId,
}
