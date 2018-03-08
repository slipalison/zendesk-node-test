'use strict';
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const queryParser = require('express-query-int')
const SwaggerExpress = require('swagger-express-mw');
const server = require('express')();
const yaml = require('js-yaml');
const fs   = require('fs');
const swaggerDocument = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf8'));

const config = {
  appRoot: __dirname 
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  server.use(bodyParser.json())
  server.use(queryParser())

  swaggerExpress.register(server);
  var port = process.env.PORT || 7000;
  server.listen(port, function () {
    console.log(`BACKEND is running on port ${port}.`)
  })

  require('./config/routes')(server)
});

module.exports = server; 

