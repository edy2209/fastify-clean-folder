import Fastify from 'fastify';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoute.js';

const fastify = Fastify({ logger: true });

fastify.register(userRoutes);
// ====== DOKUMENTASI API ======
// {{DOCS_SETUP}}

const start = async () => {
    try {
        await connectDB();
        const address = await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
        console.log(`\n\x1b[32m🚀 Server successfully launched at:\x1b[0m \x1b[36m${address}\x1b[0m`);
        console.log(`\x1b[33m📖 Swagger/Scalar API Documentation:\x1b[0m \x1b[36m${address}/docs\x1b[0m\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
