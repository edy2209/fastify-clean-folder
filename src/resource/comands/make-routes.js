import { {{models}}Controller } from "../controllers/{{models}}Controller.js";

export default async function {{models}}Routes(fastify) {
    fastify.get('/{{models}}', {{models}}Controller.getAll);
    fastify.get('/{{models}}/:id', {{models}}Controller.getById);
    fastify.post('/{{models}}', {{models}}Controller.create);
    fastify.put('/{{models}}/:id', {{models}}Controller.update);
    fastify.delete('/{{models}}/:id', {{models}}Controller.delete);
}