const { SECRET } = process.env
const { url } = require('../tgUtils')
const _fetch = require('node-fetch')
const _url = require('url')

module.exports = (req, res) => {
  const query = _url.parse(req.url).query
  if (query.token !== SECRET) {
    return res.status(403).send({ error: 'No authorized' })
  }
  _fetch(url('getWebhookInfo'))
    .then(res => res.text())
    .then(text => {
      res.end(text)
    })
}
