FROM node:12.6.0-stretch as base

WORKDIR /src

COPY webapp .

# FROM base as dev
# 
# RUN apt-get update && \
#       apt-get install -y --no-install-recommends vim && \
#       rm -rf /var/lib/apt/lists/* && \
#       yarn && \
#       ./node_modules/.bin/webpack --config config/webpack.dev.js && \
#       yarn add light-server
# 
# COPY entrypoint.sh .

FROM base as builder

RUN yarn && \
      ./node_modules/.bin/webpack --config config/webpack.prod.js

FROM nginx:1.15

WORKDIR /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /assets static/

RUN mv static/js/index.html .
