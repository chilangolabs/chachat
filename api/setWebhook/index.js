const { body, url } = require('../tgUtils')
const _fetch = require('node-fetch')

module.exports = (req, res) => {
  _fetch(
    url('setWebhook'),
    body({ url: 'https://chachatbot.elxris.now.sh/api' })
  )
    .then(res => res.text())
    .then(text => {
      res.end(text)
    })
}
