'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const tplink     = require('./src/tplink');
const logger     = require('./src/config/logger');

const client = new tplink.Create();
const app = express();

logger.info('[API] - registering middleware');
app.use(bodyParser.json());
app.use(morgan('combined'));
logger.info('[API] - completed registering middleware');

app.get('/health', function (req, res) {
  logger.info('[API][Health] - healthcheck');
  res.send('ok');
});

app.get('/plugs', function (req, res) {
  logger.info('[API][Plugs][List]  - list all plugs on network');

  client.getAll().then((plugs) => {
    res.send(plugs);
  });
});

app.get('/plugs/:deviceId', function (req, res) {
  logger.info('[API][Plugs][Info]  - get device info', req.params.deviceId);

  client.getInfoByDeviceId(req.params.deviceId).then((info) => {
    res.send(info);
  });
});

app.get('/plugs/:deviceId/on', function (req, res) {
  logger.info('[API][Plugs][On]  - turn on device', req.params.deviceId);
  if (req.params.deviceId.indexOf(".")>0){
	  const Hs100Api = require('hs100-api');
	  const auxClient = new Hs100Api.Client();
	  const auxPlug = auxClient.getPlug({host: req.params.deviceId});
	  auxPlug.setPowerState(true);
	  const info=auxPlug.getSysInfo();
	  res.send(info);
  } else {
	  client.turnOnByDeviceId(req.params.deviceId).then((info) => {
	    res.send(info);
	  });
  }
});

app.get('/plugs/:deviceId/off', function (req, res) {
  logger.info('[API][Plugs][Off] - turn off device', req.params.deviceId);
  if (req.params.deviceId.indexOf(".")>0){
	  const Hs100Api = require('hs100-api');
	  const auxClient = new Hs100Api.Client();
	  const auxPlug = auxClient.getPlug({host: req.params.deviceId});
	  auxPlug.setPowerState(false);
	  const info=auxPlug.getSysInfo();
	  res.send(info);
  } else {
	  client.turnOffByDeviceId(req.params.deviceId).then((info) => {
	    res.send(info);
	  });
  }
});

const sCommand='kodi-send --host=192.168.100.11 --action="ActivateScreenSaver"';
var execAsync = require('exec-async');

let script = "echo \'hello\' $(whoami)\nls -l\necho 'bye'"

execAsync('sh', ['-c', script]).then(console.log).catch(console.log);

app.listen(3000, () => {
  logger.info('[API] - listening on port 3000');
});
