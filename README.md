# TPLink HS100 Home Hub (Unofficial)

This NodeJS server is a simplification of the arhea/tplink-hs100 (https://github.com/arhea/tplink-hs100) project for systems x86_64 because I can´t build the arhea arm project part and in my network/docker configuration the discovery functions are not working.

It includes a url function to put On/Off a plug using the network IP calling to the NodeJS HS100 module directly.

This NodeJS server is a simple REST API to discover and interact with [TPLink HS100 Smart Plugs](http://www.tp-link.com/us/products/details/cat-5516_HS100.html) that runs on a [Docker X86_64 container] on your home network. This hub interacts over REST API and also comes with a [Samsung SmartThings](https://www.smartthings.com/) Integration.

It´s prepared to install and run with Rancher (https://rancher.com/)

## Getting Started

Install docker in your system (it´s probed in a ubuntu 16.04)

Install rancher and login in it.

Install container RCGCoder/tplink-hs100 setting visible port 3000 

Now, visit the `http://<ip address of the host>:3000/plugs` and you should see all of your plugs listed. Theoretically new plugs will automatically be discovered once they are configured using the Kasa app.

You can use `http://<ip address of the host>:3000/on/ip=<plugIp>` to switch on the plug
You can use `http://<ip address of the host>:3000/off/ip=<plugIp>` to switch off the plug


## Samsung SmartThings Integration (not tested. Inherited from ahrea's code)
1. Login to the [SmartThings IDE](https://graph-na02-useast1.api.smartthings.com)
2. Go to the "My SmartApps" page and click "Settings"
3. Add this repository to the list of repositories.
4. Select the TPLink Home Hub and add the script.
5. Go to the "My Device Handler" page and click "Updaet from Repo" and select the device type. Check the box that says publish.

## REST API
The following REST API is exposed by the service.

- `GET` - `/plugs` - List all the plugs on the network.
- `GET` - `/plugs/:deviceId` - Get information about a specific plug on the network.
- `GET` - `/plugs/:deviceId/on` - Turn the plug on.
- `GET` - `/plugs/:deviceId/off` - Turn the plug off.

## Thanks
Thanks to [arhea/tplink-hs100] (https://github.com/arhea/tplink-hs100) that serves as base of this fork
Thanks to [hs100-api](https://github.com/plasticrake/hs100-api) that serves as the underpinning of this service.
