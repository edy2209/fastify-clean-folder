import User from '../models/example.userModel.js';

export async function getUsers(request, reply) {
    const users = await User.find();
    return reply.send({ status: 'success', data: users });
}

export async function createUser(request, reply) {
    const user = await User.create(request.body);
    return reply.code(201).send({ status: 'success', data: user });
}
