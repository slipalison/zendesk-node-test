'use strict'
const service = require('../services/zendeskService')

const addCompanyOnZendesk = async ({companyName, companySubdomain}) => {
  try {
    let zemail = await service.createEmail(companyName, companySubdomain)
    let groups = await service.getGroups()
    let {id} = groups.find((x) => { return x.name === 'Corporativo' })
    let trigger = await service.createTrigger(companyName, zemail.recipient_address.email, id)
    let organization = await service.createOrganization(companyName)

    return {
      zemail,
      trigger,
      organization
    }
  } catch (ex) {
    throw ex
  }
}

module.exports = {
  addCompanyOnZendesk
}
