'use strict';

var utils = require('../utils/writer.js');
var Taxex = require('../service/TaxexService');

module.exports.classifyEmail = function classifyEmail (req, res, next, body, projectId, apiKey) {
  //console.log("Req: " + JSON.stringify(req));
  Taxex.getBearer(req, apiKey)
    .then(function (bearerTokenResponse) {
      console.log('****bearerTokenResponse: ', bearerTokenResponse);
      Taxex.classifyEmail(body, projectId, bearerTokenResponse)
      .then(function (watsonxResponse) {
        utils.writeJson(res, watsonxResponse);
      })
      .catch(function (watsonxResponse) {
        utils.writeJson(res, watsonxResponse);
      });
    })
    .catch(function (bearerTokenResponse) {
      utils.writeJson(res, bearerTokenResponse);
    });
};
