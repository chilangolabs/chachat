const { SECRET } = process.env
const { url } = require('../tgUtils')
const _fetch = require('node-fetch')

module.exports = (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(403).send({ error: 'No authorized' })
  }
  _fetch(url('deleteWebhook'))
    .then(res => res.text())
    .then(text => {
      res.end(text)
    })
}
