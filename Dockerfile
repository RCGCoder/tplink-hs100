FROM alpine

MAINTAINER RCGCoder <ricardo.cantabran@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Speed up APT
#RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup \
#  && echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

RUN apk update 
RUN apk apk upgrade
RUN apk add curl nodejs nodejs-npm wget
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
RUN mkdir -p /usr/src/app/src/tplink
RUN mkdir -p /usr/src/app/src/config


WORKDIR /usr/src/app
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/package.json
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/index.js
RUN npm install

WORKDIR /usr/src/app/src/tplink
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/src/tplink/index.js

WORKDIR /usr/src/app/src/config
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/src/config/logger.js

WORKDIR /usr/src/app

HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1

CMD [ "npm", "start" ] 

