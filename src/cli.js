import { intro, outro, text, select, confirm, spinner, note } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import colors from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    // perintah untuk membuat resource
    if (process.argv[2] === "make:resource") {
        const resourceName = process.argv[3];
        if (!resourceName) {
            console.error(colors.red("❌ Error: Harap berikan nama resource!"));
            console.log(colors.yellow("Sintaks: npx cleancode-e make:resource <nama-resource>"));
            process.exit(1);
        }
        const { generateResource } = await import("./resource/kode-eksekusi.js");
        await generateResource(resourceName);
        process.exit(0);
    }
    // perintah untuk membuat docker
    if (process.argv[2] === "make:docker") {
        const dockerName = process.argv[3];
        if (!dockerName) {
            console.error(colors.red("❌ Error: Harap berikan nama docker!"));
            console.log(colors.yellow("Sintaks: npx cleancode-e make:docker <nama-docker>"));
            process.exit(1);
        }
        const { generateDocker } = await import("./resource/kode-eksekusi.js");
        await generateDocker(dockerName);
        process.exit(0);
    }

    console.clear();
    intro(colors.bgCyan(colors.black(" cleancode-e CLI Generator Created by EdySf ")));

    const projectName = await text({
        message: "Nama project kamu:",
        placeholder: "contoh: my-api",
        validate: (value) => {
            if (!value) return "Nama project tidak boleh kosong";
            if (value.includes(" ")) return "Nama project tidak boleh mengandung spasi";
            if (value.length < 3) return "Nama project minimal 3 karakter";
            if (/\d/.test(value)) return "Nama project tidak boleh mengandung angka";
            if (fs.existsSync(value)) return "Folder dengan nama itu sudah ada";
        },
    });

    if (typeof projectName === "symbol") {
        outro(colors.red("Dibatalkan."));
        process.exit(0);
    }

    const database = await select({
        message: "Pilih database:",
        options: [
            { value: "none", label: "Tidak pakai database (in-memory)" },
            { value: "mongo", label: "MongoDB (Mongoose)" },
            { value: "mysql", label: "MySQL (Sequelize + mysql2)" },
        ],
    });

    if (typeof database === "symbol") {
        outro(colors.red("Dibatalkan."));
        process.exit(0);
    }

    const useNodemon = await confirm({
        message: "Pakai nodemon untuk auto-reload saat development?",
        initialValue: true,
    });

    if (typeof useNodemon === "symbol") {
        outro(colors.red("Dibatalkan."));
        process.exit(0);
    }

    const dokumentasi = await select({
        message: "pilih dokumentasi",
        options: [
            { value: "swagger", label: "Swagger" },
            { value: "scaler", label: "scaler" },
        ],
    })

    if (typeof dokumentasi === "symbol") {
        outro(colors.red("Dibatalkan."));
        process.exit(0);
    }

    const targetDir = path.resolve(projectName);
    const templateDir = path.join(__dirname, "templates");

    const s = spinner();
    s.start("Menyiapkan struktur project...");

    try {
        const dirs = ["routes", "controllers", "models", "config", "plugins", "middleware"];
        for (const dir of dirs) {
            fs.mkdirSync(path.join(targetDir, dir), { recursive: true });
        }

        const from = (src) => path.join(templateDir, src);
        const to = (dest) => path.join(targetDir, dest);
        const cp = (src, dest) => fs.copyFileSync(from(src), to(dest));

        cp(`app.${database}.js`, "app.js");
        cp(".env.example", ".env.example");

        cp("routes/example.userRoute.js", "routes/userRoute.js");
        cp("routes/readme.txt", "routes/readme.txt");
        cp("controllers/readme.txt", "controllers/readme.txt");
        cp("models/readme.txt", "models/readme.txt");
        cp("config/readme.txt", "config/readme.txt");
        cp("plugins/readme.txt", "plugins/readme.txt");
        cp("plugins/example.corsPlugin.js", "plugins/corsPlugin.js");
        cp("middleware/readme.txt", "middleware/readme.txt");
        cp("middleware/example.authMiddleware.js", "middleware/authMiddleware.js");

        if (database === "mongo") {
            cp("config/db.mongo.js", "config/db.js");
            cp("models/example.userModel.mongo.js", "models/userModel.js");
            cp("controllers/example.userController.mongo.js", "controllers/userController.js");
        } else if (database === "mysql") {
            cp("config/db.mysql.js", "config/db.js");
            cp("models/example.userModel.mysql.js", "models/User.js");
            cp("controllers/example.userController.mysql.js", "controllers/userController.js");
        } else {
            cp("controllers/example.userController.none.js", "controllers/userController.js");
        }

        //ambil isi file app.js yang sudah di buat
        const appJsPath = to("app.js");
        let appJsContent = fs.readFileSync(appJsPath, "utf-8");

        //--mempersiapkan Script DOKUMENTASI

        let docsScript = "";

        if (dokumentasi === "swagger") {
            docsScript = `
            //--DOKUMENTASI SWAGGER--
            fastify.register(import("@fastify/swagger"), {
                openapi: {
                    info: {
                        title: "${projectName}",  // <-- Jangan lupa pakai tanda kutip untuk string!
                        description: "API Documentation",
                        version: "1.0.0",
                    },
                    servers: [
                        {
                            url: "http://localhost:3000",
                            description: "Development",
                        },
                    ],
                },
            });
            fastify.register(import("@fastify/swagger-ui"), {
                routePrefix: "/docs",
            });
            `
        } else if (dokumentasi === "scaler") {
            docsScript = `
            //--DOKUMENTASI SCALER--
            fastify.register(import("@fastify/swagger"), {
                openapi: {
                    info: {
                        title: "${projectName}",
                        description: "API Documentation",
                        version: "1.0.0",
                    },
                    servers: [
                        {
                            url: "http://localhost:3000",
                            description: "Development",
                        },
                    ],
                },
            });
            fastify.register(import("@scalar/fastify-api-reference"), {
                routePrefix: "/docs",
            });
            `
        }


        //--ganti penanda {{DOCS_SETUP}}
        appJsContent = appJsContent.replace("{{DOCS_SETUP}}", docsScript);

        fs.writeFileSync(appJsPath, appJsContent);

        const deps = { fastify: "latest" };
        if (database === "mongo") deps.mongoose = "latest";
        if (database === "mysql") {
            deps.sequelize = "latest";
            deps.mysql2 = "latest";
        }

        fs.writeFileSync(
            to("package.json"),
            JSON.stringify({
                name: projectName,
                version: "1.0.0",
                type: "module",
                main: "app.js",
                scripts: {
                    start: "node app.js",
                    dev: useNodemon ? "nodemon app.js" : "node --watch app.js",
                },
                dependencies: deps,
            }, null, 2)
        );

        s.stop("Struktur project berhasil dibuat!");

        const installSpinner = spinner();
        installSpinner.start("Menginstall dependencies (ini mungkin memakan waktu >_<)...");

        const installList = ["fastify"];
        if (database === "mongo") installList.push("mongoose");
        if (database === "mysql") installList.push("sequelize", "mysql2");
        if (dokumentasi === "swagger") installList.push("@fastify/swagger", "@fastify/swagger-ui");
        if (dokumentasi === "scaler") installList.push("@fastify/swagger", "@scalar/fastify-api-reference");

        await execa("npm", ["install", ...installList], { cwd: targetDir });

        if (useNodemon) {
            await execa("npm", ["install", "--save-dev", "nodemon"], { cwd: targetDir });
        }

        installSpinner.stop("Dependencies berhasil diinstall!");

        note(
            [
                `Project berhasil dibuat di: ${colors.cyan(targetDir)}`,
                "",
                `  cd ${projectName}`,
                `  npm start`,
                "",
                `Created by @edy_syafrianto`,
                `https://github.com/edy2209`,
                `version 1.2.1`,
                database !== "none"
                    ? `Isi ${colors.yellow(".env.example")} lalu rename jadi ${colors.yellow(".env")}`
                    : "",
            ].filter(Boolean).join("\n"),
            "Selesai!"

        );

        outro(colors.green("folder berhasil dibuat, Selamat berkarya! masbro 🚀"));
    } catch (err) {
        s.stop(colors.red("Terjadi kesalahan!"));
        console.error(err);
        outro(colors.red("Proses pembuatan project gagal."));
        process.exit(1);
    }
}

main();