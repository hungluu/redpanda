const logger = require('../lib/logger')
const projectConfig = require('../../project.config.js')

logger.info('Starting server...')
require('../../dev-server/main').listen(projectConfig.devPort, () => {
  logger.success('Server is running at http://localhost:' + projectConfig.devPort)
})
