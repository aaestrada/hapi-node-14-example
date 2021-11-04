'use strict';

const Hapi = require('@hapi/hapi');
const Pino = require('hapi-pino');
const getResponse = [
    {string: 'string1', number: 1, boolean: true},
    {string: 'string2', number: 2, boolean: false},
];

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/items',
        handler: function (request, h) {
            return h.response(getResponse);
        }
    });
    
    await server.register({
        plugin: Pino,
        options: {}
      });

    await server.start();
    console.log('Server running on %s', `${server.info.uri}/items`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();