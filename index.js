'use strict'
// see docs https://github.com/pinojs/pino/blob/master/docs/pretty.md *prod
// see docs https://github.com/pinojs/pino-pretty *dev
const Hapi = require('@hapi/hapi');
const Pino = require('hapi-pino');
const Path = require('path');
const { join } = require('path');
const SonicBoom = require('sonic-boom');

const getResponse = [
  {string: 'string1', number: 1, boolean: true},
  {string: 'string2', number: 2, boolean: false},
];

async function start () {
  // Create a server with a host and port
  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    debug: false, // disable Hapi debug console logging
  })

  // Add the route
  server.route({
    method: 'GET',
    path: '/items',
    handler: async function (request, h) {
    // test sonicBoob library works
    // const sonic = new SonicBoom({
    //   dest: './pino-logs/node_trace.1.log',
    //   append: true,
    //   mkdir: true
    // });
    return h.response(getResponse);
    }
  })
  const tmpDir = Path.join(__dirname, '.tmp_' + Date.now())
  const destination = join(tmpDir, 'output')

  await server.register({
    plugin: Pino,
    options: {
      logPayload: true,
      mergeHapiLogData: true,
      ignorePaths: ['/alive.txt', '/private'],
      ignoreFunc: (options, request) => request.path.startsWith('/private'),
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          minimumLevel: "info",
          levelFirst: true,
          messageFormat: true,
          timestampKey: "time",
          translateTime: true,
          singleLine: true,
          mkdir: true,
          append: false, //the next line is breaking the app
          // destination: new SonicBoom({ dest: destination, async: true, mkdir: true, append: true }),
        }
      }
    }
  });
  await server.start();
  server.log(['info'], `server running: ${server.info.uri}/items`);
  return server
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})