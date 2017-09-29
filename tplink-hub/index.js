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

const util = require('util');
const exec = util.promisify(require('child_process').exec);

var ls=function() {
  var stdout="";
  var stderr="";
  logger.info('Calling ls');
  (stdout, stderr) = await exec('ls');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
ls();

/*
const  exec = require('child_process');
exec('kodi-send --host=192.168.100.11 --action="ActivateScreenSaver"', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
*/


app.listen(3000, () => {
  logger.info('[API] - listening on port 3000');
});
