const logger = require('pino')()

module.exports = ({ server }) => {
  server.use('/', (req, res) => {
    logger.info()
    res.logger = logger;
  })
}