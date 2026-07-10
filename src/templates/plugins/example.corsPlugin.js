import cors from '@fastify/cors';

export default async function corsPlugin(fastify) {
    await fastify.register(cors, {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    });
}
