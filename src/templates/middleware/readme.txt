middleware/
Folder ini berisi fungsi middleware (hook) Fastify.
Middleware biasanya digunakan untuk autentikasi, logging, dan validasi request.
Daftarkan sebagai hook di app.js: fastify.addHook('preHandler', myMiddleware)
Penamaan file: namaMiddleware.middleware.js  →  contoh: auth.middleware.js
