'use strict'
// see docs https://github.com/pinojs/pino/blob/master/docs/pretty.md *prod
// see docs https://github.com/pinojs/pino-pretty *dev
const Hapi = require('@hapi/hapi');
const Pino = require('hapi-pino');
const noir = require('pino-noir');
const SonicBoom = require('sonic-boom/index.js');
// const sonic = new SonicBoom({
//   dest: './pino-logs/node_trace.1.log',
//   append: true,
//   mkdir: true
// });

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
    options: {
        cache: { expiresIn: 5000 },
        handler: async function (request, h) {
          try {
            server.log('GET_items',getResponse)
            return getResponse;
        }
        catch (err) {
            return server.log('error', err)
        }
        }
    }
  });

  // func = 

  // const stream = sink(func)

  await server.register({
    plugin: Pino,
    options: {
      // mergeHapiLogData: true,
      level: 'debug',
      ignorePaths: ['/health'],
      ignoreTags: ['info'],
      tags: {GET_items: 'info'},
      serializers: noir(['key', 'path.to.key', 'check.*', 'also[*]'], 'Ssshh!'),
      logEvents: ['response', 'error' ],
      // ignoredEventTags: { log: ['SERVER_INFO', 'TEST'], request: ['SERVER_INFO', 'TEST'] },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          tags: {GET_items: 'info'},
          timestampKey: 'time', // --timestampKey
          translateTime: false, // --translateTime
          // singleLine: true,
          hideObject: true, // enabled in production
          destination: 1
        }
      }
    }
  });
  await server.start();
  server.log(['SERVER_INFO'], `server running: ${server.info.uri}/items`);
  return server
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})