/**
 * This small scripts listens to mqtt topics and publishes it via json.
 * The last value is stored. The values are hold in process in dataStruct and
 * updated when a new value comes on the same topic.
 *
 * @author Thomas Frei
 * @version 0.0.1
 *
 * @type {exports|module.exports}
 */

// configuration
var mqttHost = 'mqtt://mi5.itq.de';
var jsonTopic = '/mqttJsonBridge/'; // important dash beginning, end '/foo/';
var port = 3000;

// libraries
var mqtt    = require('mqtt');
var express = require('express');
var _       = require('underscore');

// temp
var dataStruct = [];

var app = express();
var client  = mqtt.connect(mqttHost);

client.on('connect', function () {
  client.subscribe(jsonTopic+'#'); // add wildcard
  console.log('subscribed to:',jsonTopic);
});
 
client.on('message', function (topic, message) {
  // message is Buffer
  addOrReplace(topic, message.toString());
});

// dynamic route
app.get(jsonTopic+':dynamic', function(req,res) {
  var topic = convertDynamicRoute(req.params.dynamic);
  console.log('look for               ', topic);

  res.json(_.findWhere(dataStruct, {topic: topic}));
});

app.listen(port);

/**
 * convert the json route:
 * http://localhost:3000/jsonBridge/hi-ho-ha
 *
 * returns: hi/ho/ha
 *
 * This is necessary because express interpretes dashes as other route
 *
 * @param dynamic string
 * @returns {string}
 */
function convertDynamicRoute(dynamic){
  return jsonTopic + dynamic.replace(/-/g,'/'); //replace a - by a /
}

/**
 * add a topic and its message to dataStruct or replace existing entry
 *
 * @param topic string
 * @param message string
 */
function addOrReplace(topic, message){
  if(_.isEmpty(_.findWhere(dataStruct, {topic: topic}))){
    // Entry does not exist
    dataStruct.push({topic: topic, message: message});
    console.log('added new entry:       ', topic, message);
  } else {
    // update entry
    var index = _.findLastIndex(dataStruct, {topic: topic});
    dataStruct[index] = {topic: topic, message: message};
    console.log('updated existing entry:', topic, message);
  }
}