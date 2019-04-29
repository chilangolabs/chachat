const { url } = require('../tgUtils')
const _fetch = require('node-fetch')

module.exports = (req, res) => {
  _fetch(url('getWebhookInfo'))
    .then(res => res.text())
    .then(text => {
      res.end(text)
    })
}
