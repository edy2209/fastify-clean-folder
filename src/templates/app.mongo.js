import Fastify from 'fastify';
import { connectDB } from './config/db.js';
import userRoutes from './routes/example.userRoute.js';

const fastify = Fastify({ logger: true });

fastify.register(userRoutes);

const start = async () => {
    try {
        await connectDB();
        await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
