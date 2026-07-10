import Fastify from 'fastify';
import userRoutes from './routes/userRoutes.js';

const fastify = Fastify({ logger: true });

fastify.register(userRoutes);

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
