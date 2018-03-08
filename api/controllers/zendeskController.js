'use strict'
const app = require('../applications/zendeskApplication')

const add = async (req, res, next) => {
  var company = {}
  var {
    companyName,
    companySubdomain
  } = company = req.body;

  if (!companyName || !companySubdomain) {
    res.status(422).json({
      message: 'CompanyName e CompanySubdomain não podem ser nulos ou vazios'
    })
  }

  try {
    var result = await app.addCompanyOnZendesk(company)
    res.status(200).json({
      success: true,
      result
    })
  } catch (ex) {
    res.status(500).json(ex);
  }
}

const createTicket = async (req, res, next) => {

}

module.exports = {
  add,
  createTicket
}
