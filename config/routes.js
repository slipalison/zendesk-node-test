const express = require('express')
const zendeskController = require('../api/controllers/zendeskController')


module.exports = (server) => {
  const protectedRoutes = express.Router()
  server.use('/api', protectedRoutes)
  protectedRoutes.post('/v1/zendesk/add', zendeskController.add)
  protectedRoutes.post('/v1/zendesk/ticket', zendeskController.createTicket)
}
