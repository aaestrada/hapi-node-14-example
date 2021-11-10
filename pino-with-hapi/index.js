"use strict";
// see docs https://github.com/pinojs/pino/blob/master/docs/pretty.md *prod
// see docs https://github.com/pinojs/pino-pretty *dev
const Hapi = require("@hapi/hapi");
const Pino = require('pino')
const HapiPino = require("hapi-pino");
const noir = require("pino-noir");
const path = require('path')

const { join } = require('path')
const fs = require('fs');
const SonicBoom = require('sonic-boom');

const getResponse = [
  { string: "string1", number: 1, boolean: true },
  { string: "string2", number: 2, boolean: false }
];

async function start() {

  // Create a server with a host and port
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
    debug: false // disable Hapi debug console logging
  });

  // Disable pino warnings
  process.removeAllListeners('warning')

  // Add the route
  server.route({
    method: "GET",
    path: "/items",
    options: {
      log: { collect: true },
      cache: { expiresIn: 5000 },
      handler: async function (request, h) {
        try {
          // you can also use a pino instance, which will be faster
          request.logger.info('GET_items', getResponse)
          return h.response(getResponse);
        } catch (err) {
          return request.logger.error('GET_error', err)
        }
      }
    }
  });

  server.route({
    method: "GET",
    path: "/",
    options: {
      log: { collect: true },
      cache: { expiresIn: 5000 },
      handler: async function (request, h) {
        return request.logger.error('GET_error', 'some error here')
      }
    }
  });

  const tmpDir = path.join(__dirname, '.tmp_' + Date.now())
  const destination = join(tmpDir, 'output');

  const transport = Pino.transport({
    targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
          singleLine: true,
          ignorePaths: ['/favicon.ico'],
          logRequestComplete: false,
          append: true,
          mkdir: true,
          destination: 'logs/.info.log'
      }
    },
    {
      level: 'error',
      target: 'pino-pretty',
      options: {
          destination: 'logs/.error.log'
      }
    }]
  });

  const options = {
    prettyPrint: true,
    instance: Pino(transport)
  }

  await server.register({
    plugin: HapiPino,
    options
  });

  await server.start();
  server.log(["SERVER_INFO"], `Items endPoint running: ${server.info.uri}/items`);
  return server;
}

start().catch((err) => {
  console.log(err);
  process.exit(1);
});
