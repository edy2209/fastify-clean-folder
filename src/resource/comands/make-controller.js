import {{models}} from "../models/{{models}}.js";

export const {{models}}Controller = {
    getAll: async (request, reply) => {
        try {
            const data = await {{models}}.find();
            return reply.send(data);
        } catch (error) {
            return reply.code(500).send({ message: error.message });
        }
    },
    getById: async (request, reply) => {
        try {
            const data = await {{models}}.findById(request.params.id);
            if (!data) {
                return reply.code(404).send({ message: 'Resource not found' });
            }
            return reply.send(data);
        } catch (error) {
            return reply.code(500).send({ message: error.message });
        }
    },
    create: async (request, reply) => {
        try {
            const data = new {{models}}(request.body);
            await data.save();
            return reply.code(201).send(data);
        } catch (error) {
            return reply.code(500).send({ message: error.message });
        }
    },
    update: async (request, reply) => {
        try {
            const data = await {{models}}.findByIdAndUpdate(request.params.id, request.body, { new: true });
            if (!data) {
                return reply.code(404).send({ message: 'Resource not found' });
            }
            return reply.send(data);
        } catch (error) {
            return reply.code(500).send({ message: error.message });
        }
    },
    delete: async (request, reply) => {
        try {
            const data = await {{models}}.findByIdAndDelete(request.params.id);
            if (!data) {
                return reply.code(404).send({ message: 'Resource not found' });
            }
            return reply.send({ message: 'Resource deleted successfully', data });
        } catch (error) {
            return reply.code(500).send({ message: error.message });
        }
    },
};

