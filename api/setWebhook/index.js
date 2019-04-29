const { SECRET } = process.env
const { body, url } = require('../tgUtils')
const _fetch = require('node-fetch')
const _url = require('url')

module.exports = (req, res) => {
  const query = _url.parse(req.url).query
  if (query.token !== SECRET) {
    return res.status(403).send({ error: 'No authorized' })
  }
  _fetch(
    url('setWebhook'),
    body({ url: `https://chachatbot.elxris.now.sh/api?token=${SECRET}` })
  )
    .then(res => res.text())
    .then(text => {
      res.end(text)
    })
}
