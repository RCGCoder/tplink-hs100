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

app.get('/kodi/:deviceId/screensaver/on', function (req, res) {
	logger.info('[API][Kodi][ScreenSaver][On] - turn on kodi screensaver', req.params.deviceId);
	var xbmc = require('xbmc');

	// Connect to XBMC
	// The options below are the defaults
	xbmc.connect({
	  host: req.params.deviceId,
	  port: 8080,
	  reconnect: true,
	  reconnect_sleep: 3000
	});

	// Lets you know when we are connected
	xbmc.on('connect', function () {
	  console.log("connected to xbmc!");
	});

	// Run any XBMC API command and get the results
	// NOTE: If you are not connected the call will be placed in a queue and executed as the connection is restored.
	xbmc.run("GUI.ActivateWindow", {"window":"screensaver"}, function (res) {
	  console.log(res.result);
	});

	// Get notified on any notifications you desire
	/*xbmc.on("Application.OnVolumeChanged", function (data) {
	  console.log(data);
	});*/

	// Changes connection options
	/*xbmc.setOptions({
	  host: "localhost",
	  port: 9090,
	  reconnect: true,
	  reconnect_sleep: 30000
	});*/

	// Closes the connection to XBMC
//	xbmc.close();
});

app.listen(3000, () => {
  logger.info('[API] - listening on port 3000');
});
