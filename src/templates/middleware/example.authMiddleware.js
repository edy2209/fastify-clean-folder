export async function authMiddleware(request, reply) {
    const token = request.headers['authorization'];
    if (!token) {
        return reply.code(401).send({ status: 'error', message: 'Unauthorized' });
    }
    // TODO: verifikasi token JWT di sini
    // const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    // request.user = decoded;
}
