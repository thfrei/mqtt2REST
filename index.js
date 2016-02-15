/**
 * This small scripts listens to mqtt topics and publishes it via json.
 * The last value is stored. The values are hold in process in dataStruct and
 * updated when a new value comes on the same topic.
 *
 * MQTT Topic: /jsonTopic/roomA/measurements/temperature
 * REST: http://localHost:port/jsonTopic/roomA-measurements-temperature
 *
 * @author Thomas Frei
 * @version 0.0.1
 *
 * @type {exports|module.exports}
 */

var config = require('./config.js');

// configuration
var mqttHost = config.mqttHost;
var jsonTopic = config.jsonTopic;
var localHost = config.localHost;
var port = config.port;

// libraries
var mqtt    = require('mqtt');
var express = require('express');
var _       = require('underscore');

// Fixing CORS
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-node-js
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', localHost);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

// temp
var dataStruct = [];

var app = express();
app.use(allowCrossDomain);
var client  = mqtt.connect(mqttHost);

client.on('connect', function () {
  console.log('connected to:',mqttHost);
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