const { REDIS_PASSWORD, REDIS_ENDPOINT } = process.env
const { promisify } = require('util')
const Redis = require('redis')

const _redisClient = Redis.createClient(REDIS_ENDPOINT, {
  password: REDIS_PASSWORD,
})
const redisClient = new Proxy(_redisClient, {
  get: (client, method) => promisify(client[method]).bind(client),
})

const redisKeyProxy = new Proxy(
  {},
  {
    get: (obj, property) => (...key) =>
      [String(property).toUpperCase(), ...key].join(':'),
  }
)

module.exports = {
  redisClient,
  redisKeyProxy,
}
