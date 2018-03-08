'use strict'
const zendesk = require('node-zendesk')
const request = require('request-promise');
const _client = zendesk.createClient({
  username: 'aamorim@acessocard.com.br',
  token: 'uKY42nAImbU9rcubN66p8vsPGSgqdDCwZMQTcBgg',
  remoteUri: 'https://acessocorptest.zendesk.com/api/v2',
  debug: true
})

const createOrganization = async (companyName) => {
  return new Promise((resolve, reject) => {
    _client.organizations.create(_payloadCreateOrganization(companyName), (err, req, result) => {
      buildResult(err, reject, resolve, result);
    })
  })
}

const createEmail = async (companyName, companySubdomain) => {
  let payload = _payloadCreateEmail(companyName, companySubdomain)
  const config = {
    method: 'POST',
    uri: 'https://acessocorptest.zendesk.com/api/v2/recipient_addresses.json',
    timeout: 20000,
    body: payload,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWFtb3JpbUBhY2Vzc29jYXJkLmNvbS5ici90b2tlbjp1S1k0Mm5BSW1iVTlyY3ViTjY2cDh2c1BHU2dxZERDd1pNUVRjQmdn'
    }
  }

  try {
    let result = await request(config)
    return result;
  } catch (ex) {
    console.log(ex)
    throw ex
  }
}

const createTrigger = async (companyName, zEmail, groupId) => {
  let promise = new Promise((resolve, reject) => {
    _client.triggers.create(_payloadCreateTrigger(companyName, zEmail, groupId), (err, req, result) => {
      buildResult(err, reject, resolve, result);
    })
  })
  return promise
}

const createTicket = async (recipient, msg, subject) => {
  return new Promise((resolve, reject) => {
    _client.tickets.create(payloadCreateTicket(recipient, msg, subject), function (err, req, result) {
      buildResult(err, reject, resolve, result);
    })
  })
}

const getGroups = async () => {
  return new Promise((resolve, reject) => {
    _client.groups.list((err, req, result) => {
      buildResult(err, reject, resolve, result);
    })
  })
}

const payloadCreateTicket = (recipient, msg, subject) => {
  return {
    ticket: {
      subject: subject,
      comment: {
        body: msg
      },
      recipient: recipient
    }
  }
}

const _payloadCreateOrganization = (companyName) => {
  return {
    organization: {
      name: `Corp - ${companyName}`
    }
  }
}

const _payloadCreateTrigger = (companyName, zEmail, groupId) => {
  return {
    'trigger': {
      'title': `Corp - ${companyName}`,
      'all': [{
        'field': 'status',
        'operator': 'less_than',
        'value': 'solved'
      }, {
        'field': 'recipient',
        'operator': 'is',
        'value': zEmail
      }],
      'actions': [{
        'field': 'group_id',
        'value': groupId
      }]
    }
  }
}

const _payloadCreateEmail = (companyName, companySubdomain) => {
  var result = {
    recipient_address: {
      name: companyName,
      email: `${companySubdomain}@acessocorptest.zendesk.com`,
      default: false
    }
  }
  return result;
}

function buildResult (err, reject, resolve, result) {
  if (err) { _handleError(err, reject); } else { resolve(result); }
}

function _handleError (err, reject) {
  console.log(err)
  reject(err)
}

module.exports = {
  createEmail,
  getGroups,
  createTrigger,
  createTicket,
  createOrganization
}
