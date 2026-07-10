<div align="center">

# ⚡ cleancode-e

**CLI Generator untuk project backend Fastify — siap pakai dalam hitungan detik.**

[![npm version](https://img.shields.io/npm/v/cleancode-e?color=cyan&style=flat-square)](https://www.npmjs.com/package/cleancode-e)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)

</div>

---

## Apa itu cleancode-e?

`cleancode-e` adalah CLI generator yang men-scaffold project backend [Fastify](https://fastify.dev) secara interaktif — lengkap dengan struktur folder siap produksi, pilihan database (MongoDB / MySQL / tanpa database), dan auto-install dependency.

Terinspirasi dari Artisan (Laravel) dan Create-React-App, tapi untuk ekosistem **Node.js + Fastify**.

---

## Quickstart

```bash
npx cleancode-e
```

> Tidak perlu install dulu. Jalankan langsung, ikuti promptnya.

---

## Cara Pakai

```bash
npx cleancode-e

# atau jika install global:
npm install -g cleancode-e
cleancode-e
```

Ikuti prompt interaktifnya:

```
┌   cleancode-e CLI Generator
│
◇  Nama project kamu:
│  my-api
│
◇  Pilih database:
│  ● Tidak pakai database (in-memory)
│  ○ MongoDB (Mongoose)
│  ○ MySQL (Sequelize + mysql2)
│
◇  Pakai nodemon untuk auto-reload saat development?
│  ● Ya  ○ Tidak
│
└  folder berhasil dibuat, Selamat berkarya! masbro 🚀
```

---

## Struktur Project yang Dihasilkan

```
my-api/
├── app.js                          # Entry point server Fastify
├── package.json                    # Scripts & dependencies
├── .env.example                    # Template environment variables
│
├── routes/
│   ├── example.userRoute.js        # Contoh route GET & POST /users
│   └── readme.txt                  # Panduan penggunaan folder routes
│
├── controllers/
│   ├── example.userController.js   # Contoh logic controller
│   └── readme.txt
│
├── models/
│   ├── example.userModel.js        # Skema User (Mongoose / Sequelize)
│   └── readme.txt
│
├── config/
│   ├── db.js                       # Koneksi database (jika dipilih)
│   └── readme.txt
│
├── plugins/
│   ├── example.corsPlugin.js       # Contoh plugin CORS
│   └── readme.txt
│
└── middleware/
    ├── example.authMiddleware.js   # Contoh middleware autentikasi
    └── readme.txt
```

---

## Dependency yang Diinstall Otomatis

| Pilihan | Package yang diinstall |
|---|---|
| Semua project | `fastify` |
| MongoDB | + `mongoose` |
| MySQL | + `sequelize`, `mysql2` |
| Nodemon (jika Ya) | `nodemon` (devDependency) |

---

## Setup Setelah Generate

### 1. Tanpa Database
Langsung jalankan:
```bash
cd my-api
npm start
# → http://localhost:3000
```

### 2. MongoDB
```bash
cd my-api

# Rename dan isi .env
cp .env.example .env
# Edit MONGO_URI di .env:
# MONGO_URI=mongodb://localhost:27017/my-api
# atau MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/my-api

npm start
```

### 3. MySQL
```bash
cd my-api

# Buat database dulu di MySQL:
# CREATE DATABASE my_api;

cp .env.example .env
# Edit .env:
# DB_HOST=localhost
# DB_NAME=my_api
# DB_USER=root
# DB_PASS=yourpassword

npm start
# Sequelize akan auto-sync tabel saat pertama kali jalan
```

---

## Scripts

| Command | Keterangan |
|---|---|
| `npm start` | Jalankan server (production) |
| `npm run dev` | Jalankan dengan nodemon (development) |

---

## Syarat

- Node.js `>= 18`
- npm `>= 8`

---

## Tech Stack

- **[Fastify](https://fastify.dev)** — Web framework Node.js ultra-cepat
- **[@clack/prompts](https://github.com/natemoo-re/clack)** — Prompt CLI yang elegan
- **[execa](https://github.com/sindresorhus/execa)** — Shell command runner
- **[picocolors](https://github.com/alexeyraspopov/picocolors)** — Terminal color output

---

## Lisensi

MIT © cleancode-e contributors
