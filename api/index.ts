import fastifyAuth0 from 'fastify-auth0-verify';
import Fastify from 'fastify';
import middie from '@fastify/middie';

import jwtAuthz from './plugins/fastify-jwt-authz';
import { testRoutes } from './routes/test';
import { dbConnector } from './db';
import { auth0Verify, testMiddleware } from './middleware';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN, NODE_ENV, PORT } from './utils/env';

const fastify = Fastify({
  logger: { level: NODE_ENV === 'development' ? 'debug' : 'fatal' }
});

fastify.get('/', async (_request, _reply) => {
  return { hello: 'world' };
});

const start = async () => {
  // NOTE: Awaited to ensure `.use` is registered on `fastify`
  await fastify.register(middie);

  // Auth0 plugin
  void fastify.register(fastifyAuth0, {
    domain: AUTH0_DOMAIN,
    audience: AUTH0_AUDIENCE
  });
  void fastify.register(jwtAuthz);

  void fastify.use('/test', testMiddleware);

  // Hooks
  void fastify.addHook('preValidation', auth0Verify);

  void fastify.register(dbConnector);
  void fastify.register(testRoutes);

  try {
    const port = Number(PORT);
    fastify.log.info(`Starting server on port ${port}`);
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
