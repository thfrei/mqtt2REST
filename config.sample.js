var config = {};
config.mqttHost = 'mqtt://test.mosquitto.org';
config.jsonTopic = '/mqttJsonBridge/'; // important dash beginning, end '/foo/';
config.localHost = 'http://localhost';
config.port = 3000;

module.exports = config;