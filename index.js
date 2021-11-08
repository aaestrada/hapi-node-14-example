"use strict";
// see docs https://github.com/pinojs/pino/blob/master/docs/pretty.md *prod
// see docs https://github.com/pinojs/pino-pretty *dev
const Hapi = require("@hapi/hapi");
const Pino = require("hapi-pino");
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

  const tmpDir = path.join(__dirname, '.tmp_' + Date.now())
  const destination = join(tmpDir, 'output')

  await server.register({
    plugin: Pino,
    options: {
      mergeHapiLogData: true,
      level: process.env.LOG_LEVEL || 'info',
      ignorePaths: ["/health"],
      ignoreTags: ["info"],
      tags: { GET_items: "info" },
      serializers: noir(["key", "path.to.key", "check.*", "also[*]"], "***!"),
      logEvents: ["response", "error"],
      redact: {
        paths: ['req.headers', 'payload.user.password', 'payload.file'],
        remove: false
      },
      // ignoredEventTags: { log: ['SERVER_INFO', 'TEST'], request: ['SERVER_INFO', 'TEST'] },
      transport: {
        target: "pino-pretty",
        options: {
          singleLine: false,
          colorize: false,
          mkdir: true,
          append: false,
          destination: `logs/${destination}/logs.log`,
        }
      }
    }
  });
  await server.start();
  server.log(["SERVER_INFO"], `server running: ${server.info.uri}/items`);
  return server;
}

start().catch((err) => {
  console.log(err);
  process.exit(1);
});
