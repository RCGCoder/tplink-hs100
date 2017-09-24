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

WORKDIR /usr/src/app
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/package.json
RUN npm install

#HEALTHCHECK exit 0 
#   CMD curl --fail http://localhost:3000/health || exit 1

CMD [ "npm", "start" ] 

