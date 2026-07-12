import { getUsers, createUser } from '../controllers/userController.js';

export default async function userRoutes(fastify) {
    fastify.get('/users', getUsers);
    fastify.post('/users', createUser);
}
