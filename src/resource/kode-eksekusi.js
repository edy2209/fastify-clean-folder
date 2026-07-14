import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import colors from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateResource(rawName) {
    if (!rawName) {
        console.error(colors.red('❌ Error: Name of the resource is required!'));
        process.exit(1);
    }

    // Standardize casing: First letter capitalized (e.g. "User")
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const lowercaseName = rawName.toLowerCase();

    // Define target directories
    const targetDir = process.cwd();
    const modelsDir = path.join(targetDir, 'models');
    const controllersDir = path.join(targetDir, 'controllers');
    const routesDir = path.join(targetDir, 'routes');

    // Check if we are inside a project (or check if directories exist/create them)
    if (!fs.existsSync(modelsDir) || !fs.existsSync(controllersDir) || !fs.existsSync(routesDir)) {
        console.log(colors.yellow('⚠️ Target directories (models/, controllers/, routes/) not fully found. Creating them...'));
        fs.mkdirSync(modelsDir, { recursive: true });
        fs.mkdirSync(controllersDir, { recursive: true });
        fs.mkdirSync(routesDir, { recursive: true });
    }

    // Template paths
    const templateModelPath = path.join(__dirname, 'comands', 'make-model.js');
    const templateControllerPath = path.join(__dirname, 'comands', 'make-controller.js');
    const templateRoutesPath = path.join(__dirname, 'comands', 'make-routes.js');

    // Verify templates exist
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
