const users = [];

export async function getUsers(request, reply) {
    return reply.send({ status: 'success', data: users });
}

export async function createUser(request, reply) {
    const { name, email } = request.body;
    const user = { id: users.length + 1, name, email };
    users.push(user);
    return reply.code(201).send({ status: 'success', data: user });
}
