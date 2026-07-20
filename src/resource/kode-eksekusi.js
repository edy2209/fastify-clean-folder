import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import colors from 'picocolors';
import { select } from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper untuk mencari root directory project (yang berisi package.json) secara rekursif ke atas
function findProjectRoot(startDir) {
    let currentDir = startDir;
    while (currentDir) {
        if (fs.existsSync(path.join(currentDir, 'package.json'))) {
            return currentDir;
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            break; // Mentok di root filesystem
        }
        currentDir = parentDir;
    }
    return null;
}

export async function generateResource(rawName) {
    if (!rawName) {
        console.error(colors.red('❌ Error: Name of the resource is required!'));
        process.exit(1);
    }

    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const lowercaseName = rawName.toLowerCase();

    // Cari project root
    const projectRoot = findProjectRoot(process.cwd());
    const targetDir = projectRoot || process.cwd();

    if (!projectRoot) {
        console.log(colors.yellow('⚠️ Warning: File package.json tidak ditemukan di direktori aktif Anda atau parent-nya.'));
        console.log(colors.yellow('Membuat resource di folder saat ini...'));
    }

    const modelsDir = path.join(targetDir, 'models');
    const controllersDir = path.join(targetDir, 'controllers');
    const routesDir = path.join(targetDir, 'routes');

    if (!fs.existsSync(modelsDir) || !fs.existsSync(controllersDir) || !fs.existsSync(routesDir)) {
        console.log(colors.yellow('⚠️ Target directories (models/, controllers/, routes/) not fully found. Creating them...'));
        fs.mkdirSync(modelsDir, { recursive: true });
        fs.mkdirSync(controllersDir, { recursive: true });
        fs.mkdirSync(routesDir, { recursive: true });
    }

    const templateModelPath = path.join(__dirname, 'comands', 'make-model.js');
    const templateControllerPath = path.join(__dirname, 'comands', 'make-controller.js');
    const templateRoutesPath = path.join(__dirname, 'comands', 'make-routes.js');

    if (!fs.existsSync(templateModelPath) || !fs.existsSync(templateControllerPath) || !fs.existsSync(templateRoutesPath)) {
        console.error(colors.red('❌ Error: Resource templates not found inside the cli generator!'));
        process.exit(1);
    }

    console.log(colors.cyan(`\n🏗️  Generating resource files for: ${colors.bold(capitalizedName)}...`));

    try {
        // 1. Generate Model
        let modelContent = fs.readFileSync(templateModelPath, 'utf8');
        modelContent = modelContent.replace(/\{\{models\}\}/g, capitalizedName);
        fs.writeFileSync(path.join(modelsDir, `${capitalizedName}.js`), modelContent, 'utf8');
        console.log(colors.green(`   ✔ Created Model      : models/${capitalizedName}.js`));

        // 2. Generate Controller
        let controllerContent = fs.readFileSync(templateControllerPath, 'utf8');
        controllerContent = controllerContent.replace(/\{\{models\}\}/g, capitalizedName);
        fs.writeFileSync(path.join(controllersDir, `${capitalizedName}Controller.js`), controllerContent, 'utf8');
        console.log(colors.green(`   ✔ Created Controller : controllers/${capitalizedName}Controller.js`));

        // 3. Generate Routes
        let routesContent = fs.readFileSync(templateRoutesPath, 'utf8');
        routesContent = routesContent.replace(/\{\{models\}\}/g, capitalizedName);
        
        // Convert route path to lowercase for neat REST resource path
        routesContent = routesContent.replace(new RegExp(`'/${capitalizedName}'`, 'g'), `'/${lowercaseName}'`);
        routesContent = routesContent.replace(new RegExp(`'/${capitalizedName}/:id'`, 'g'), `'/${lowercaseName}/:id'`);
        
        fs.writeFileSync(path.join(routesDir, `${capitalizedName}Routes.js`), routesContent, 'utf8');
        console.log(colors.green(`   ✔ Created Routes     : routes/${capitalizedName}Routes.js`));

        console.log(colors.green(`\n✨ Resource ${colors.bold(capitalizedName)} successfully generated!`));
        console.log(colors.yellow(`💡 Jangan lupa register routes tersebut di app.js:`));
        console.log(colors.gray(`   import ${lowercaseName}Routes from './routes/${capitalizedName}Routes.js';`));
        console.log(colors.gray(`   fastify.register(${lowercaseName}Routes);`));
    } catch (error) {
        console.error(colors.red('❌ Failed to generate resource:'), error);
    }
}

export async function generateDocker(rawName) {
    if (!rawName) {
        console.error(colors.red('❌ Error: Harap berikan nama docker!'));
        process.exit(1);
    }

    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    
    // Cari project root
    const projectRoot = findProjectRoot(process.cwd());
    const targetDir = projectRoot || process.cwd();
    const dockerDir = path.join(targetDir, '');

    const dbType = await select({
        message: 'Pilih database:',
        options: [
            { value: 'none', label: 'Tidak pakai database (in-memory)' },
            { value: 'mongo', label: 'MongoDB (Mongoose)' },
            { value: 'mysql', label: 'MySQL (Sequelize + mysql2)' },
        ],
    });
    if (typeof dbType === 'symbol') {
        console.log(colors.red('❌ Error: Database type is required!'));
        process.exit(0);
    }

    const templateDockerfile = path.join(__dirname, 'comands', 'Dockerfile');
    const templateComposeSelectedPath = path.join(__dirname, 'comands', `docker-compose.${dbType}.yml`);

    //validasi apakah file template aslinya ada
    if (!fs.existsSync(templateDockerfile) || !fs.existsSync(templateComposeSelectedPath)) {
        console.error(colors.red('❌ Error: File template Docker tidak ditemukan di CLI generator!'));
        process.exit(1);
    }
    console.log(colors.cyan(`\n🏗️  Generating docker files for: ${colors.bold(capitalizedName)} using ${colors.bold(dbType)}...`));

    try {
        let dockerfileContent = fs.readFileSync(templateDockerfile, 'utf8');
        fs.writeFileSync(path.join(dockerDir, 'Dockerfile'), dockerfileContent, 'utf8');
        console.log(colors.green(`   ✔ Created Dockerfile      : Dockerfile`));
        let composeContent = fs.readFileSync(templateComposeSelectedPath, 'utf8');

        fs.writeFileSync(path.join(dockerDir, 'docker-compose.yml'), composeContent, 'utf8');
        console.log(colors.green(`   ✔ Created Docker Compose  : docker-compose.yml`));
        console.log(colors.green(`\n✨ Docker files successfully generated!`));
        console.log(colors.yellow('💡 Untuk menjalankan:'));
        console.log(colors.gray('   docker-compose up --build'));
    } catch (error) {
        console.error(colors.red('❌ Failed to generate docker files:'), error);
    }
}
