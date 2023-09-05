'use strict';
var request = require('request');

/**
 * Classify taxex email
 * Classify taxex email into tokens
 *
 * Taxex question for classification
 * returns Response
 **/
exports.classifyEmail = function(body, projectId, token) {

  return new Promise(function(resolve, reject) {

    var bearerToken = "Bearer " + token;
    console.log("Bearer Token: " + bearerToken);

    var question = body.question;
    console.log('Question: ', question);

   var model = "Classify question to class.  If there is no good match say I_DONT_KNOW and stop. \\n\\nQuestion:\\nMy direct report is a Release Manager, and this is properly reflected as his job in Workday. However, his W3 Profile still reflects his old Job role.\\n\\nClass:\\nJRS_NO_UPDATE\\n\\nQuestion:\\nI would like to change the primary job role.   There doesn’t seem to be a way to do it in Workday.\\n\\nClass:\\nJRS_NO_UPDATE\\n\\nQuestion:\\n I am trying to update the JRSS for my HCAM employee, xxxxxxxx. However in workday, I do not see his name under my DR’s list.\\n\\nClass:\\nHCAM_RESPONSE\\n\\nQuestion:\\n I have team members for which I need to check and change the Job role/ specialty however they are not appearing in my workday list:\\n\\nClass:\\nHCAM_RESPONSE\\n\\nQuestion:\\nNeed to change JRS, however, not able to see in workday.\\n\\nClass:\\nHCAM_RESPONSE\\n\\nQuestion:\\n My JRSS in bluepages has changed but the same doesn't reflect in bluepages.The profile in workday has also been updated, but the US bluepages still shows the old JRSS.\\n\\nClass:\\nHCAM_RESPONSE\\n\\nQuestion:\\nIf I try to change the Job Role Specialty for some of my employees in workday, the pull-down menu is empty.\\n\\nClass:\\nNOT_IN_CATALOG\\n\\nQuestion:\\nwhen I try and select a specialty for my employee there are no choices.\\n\\nClass:\\nNOT_IN_CATALOG\\n\\nQuestion:\\nI am unable to update JRSS of my DR\\n\\nClass:\\nNOT_IN_CATALOG\\n\\nQuestion:\\nMy employee has no choices when I select a specialty \\n\\nClass:\\nJOB_PROFILE\\n\\nQuestion:\\nMy JRSS on W3 is not showing correctly, on JMT tool it is PM-HCM while on W3 tool it is still old one PM-ADM,  Not sure why its not reflected in w3 pages .\\n\\nClass:\\nJMT_UPDATE\\n\\nQuestion:\\nMy designation changed, workday is updated. But on W3 under Job Role and specialist I still see my previous role.\\n\\nClass:\\nJMT_UPDATE\\n\\nQuestion:\\nEmployee Job Role Speciality as per Workday is not reflecting in Blue Pages (w3 people Profile).\\n\\nClass:\\nJMT_UPDATE\\n\\nQuestion:\\nIn Workday the new JRSS is not reflected\\n\\nClass:\\nJMT_UPDATE\\n\\nQuestion:\\nI updated my employee's JRSS in JMT tool  but it’s not reflecting in bluepages.\\n\\nClass:\\nJMT_UPDATE\\n\\nQuestion:\\nI made some changes to my reportees  JRSS last week using  JMT tool but it’s not reflecting in downstream systems like w3 and Your Career\\n\\nClass:\\nJMT_UPDATE\\n\\nQuestion:\\nChange in my employee’s Job Specialty as follows\\n\\nClass:\\nUPDATE_JRS\\n\\nQuestion:\\nPlease assign the following to the Employee\\n\\nClass:\\nUPDATE_JRS\\n\\nQuestion:\\nCan you please let me know, how I can change my JRS \\n\\nClass:\\nUPDATE_JRS\\n\\nQuestion:\\nPlease update JRS in Workday \\n\\nClass:\\nUPDATE_JRS\\n\\nQuestion:\\n" + question + "\\n\\nClass:\\n";
   console.log('Model: ', model);

    var inputPayload = {
      "model_id": "ibm/mpt-7b-instruct2",
      "input": model, 
      "parameters": {
        "decoding_method": "greedy",
        "max_new_tokens": 12,
        "min_new_tokens": 1,
        "stop_sequences": [
          "HCAM_RESPONSE",
          "NOT_IN_CATALOG",
          "JMT_UPDATE",
          "JRS_NO_UPDATE",
          "UPDATE_JRS"
        ],
        "repetition_penalty": 1
      },
      "project_id": projectId
    } 
    
    var inputStr = JSON.stringify(inputPayload);
    console.log('***inputStr: ', inputStr);

    var options = {
      'method': 'POST',
      'url': 'https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': bearerToken,
      },
      body: inputStr
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);

      var responsePayload = {
        "token" : "JMT_UPDATE",
        "boxid" : "1298189687739"
      };

      var responseJson = JSON.parse(response.body);

      console.log('***Response: ', responseJson);
      
      if (responseJson.status_code != 403) {

        var token = responseJson.results[0].generated_text
        var boxId = mapTokenToBoxId(token)

        console.log('***boxId: ', boxId);


        responsePayload = {
          "token": token,
          "boxid": boxId
        }
      }

     resolve(responsePayload);

    });

  })
}

/**
 * Get bearer token 
 *
 * returns Bearer Token given API Key
 **/
exports.getBearer = function(req, apiKey) {

  return new Promise(function(resolve, reject) {

    console.log("***getBearer");

   //var requestJson = req.headers.authorization;
   //console.log('*** Auth: ', requestJson);

   console.log('*** ApiKey: ', apiKey);

    var options = {
      'method': 'POST',
      'url': 'https://iam.cloud.ibm.com/identity/token',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
        'apikey': apiKey
      }
    };
    
    request(options, function (error, response) {
      if (error) throw new Error(error);

      var responseJson = JSON.parse(response.body);
      console.log(responseJson);

      var accessToken = responseJson.access_token;

      console.log("Token: " + accessToken );

      resolve(accessToken);

    });

  });
}

function mapTokenToBoxId (token) {

  switch (token) {
    case "HCAM_RESPONSE":
      return "1298195946951"
      break;
    case "NOT_IN_CATALOG":
      return "1289010661308"
      break;
    case "JMT_UPDATE":
      return "1298189687739"
      break;
    case "JRS_NO_UPDATE":
      return "1298192942397"
      break;
    case "UPDATE_JRS":
      return "1298189099177"
      break;
    default:
      return "1298195821449"
  }




}
