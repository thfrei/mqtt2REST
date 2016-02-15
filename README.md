MQTT 2 JSON Bridge
=============

The bridge helps you to transfrom any topic to a RESTful API in the JSON format.

Installation
-------------

```
git clone //this repository
npm install
```

Configuration
--------

Adapt the file config.sample.js to your needs and save it as config.js

```
var config = {};
config.mqttHost = 'mqtt://test.mosquitto.org';
config.jsonTopic = '/mqttJsonBridge/'; // important dash beginning, end '/foo/';
config.localHost = 'http://localhost';
config.port = 3000;

module.exports = config;
```

Usage
-----

The MQTT 2 JSON Bridge will work as follows.
On a MQTT broker (mqtt://test.mosquitto.org) we publish to a topic, that will turn to a rest interface:

```
Topic: /jsonTopic/myhouse/livingRoom/temperature
JSON Rest: http://localhost:port/jsonTopic/myhouse-livingRoom-temperature
```

Pay attention. The '/' slashes need to be converted to '-' dashes in the REST URL.

Have fun.

License
-------

MIT
