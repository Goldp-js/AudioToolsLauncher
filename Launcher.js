const { exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const { promisify } = require('util');
const path = require('path');
const axios = require("axios")
const execAsync = promisify(exec);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};
async function checkAndUpdateLauncher() {
  try {
    const scriptPath = path.basename(__filename);
    const { data } = await axios.get('https://api.github.com/repos/tu-usuario/tu-proyecto/releases/latest');
    const latestVersion = data.tag_name.replace('v', '');

    // Obtener la versión actual del script
    const currentVersion = '1.0.0';  // Ajusta esto según la versión actual de tu script

    if (latestVersion !== currentVersion) {
      console.log('¡Hay una versión más reciente disponible en GitHub!');
      console.log(`Versión actual: ${currentVersion}, Versión más reciente: ${latestVersion}`);
      console.log('Actualizando el launcher...');

      const updatedScript = await axios.get(data.assets[0].browser_download_url);
      fs.writeFileSync(scriptPath, updatedScript.data);

      console.log('Launcher actualizado exitosamente. Reinicia la aplicación.');
    } else {
      console.log('El launcher está en la última versión.');
    }
  } catch (error) {
    console.error('Error al verificar la versión o actualizar el launcher:', error.message);
    // Continuar con la ejecución del launcher incluso si hay un error al verificar la versión
  }
}

async function runDiagnostics() {
  console.log(colors.fgCyan + colors.bright + '--- Diagnóstico del sistema ---' + colors.reset);
  console.log(`Plataforma: ${process.platform}`);
  console.log(`Versión de Node.js: ${process.version}`);
  console.log(`Directorio de trabajo: ${process.cwd()}`);
  console.log(colors.reset + '-----------------------------\n');

  console.log(colors.fgCyan + colors.bright + '--- Paquetes instalados ---' + colors.reset);
  const packageJsonPath = './package.json';
  try {
    const packageJson = require(packageJsonPath);
    console.log(`Nombre del proyecto: ${packageJson.name}`);
    console.log(`Versión del proyecto: ${packageJson.version}`);
    console.log('Dependencias:');
    for (const [dependency, version] of Object.entries(packageJson.dependencies)) {
      console.log(`  ${dependency}: ${version}`);
    }
  } catch (error) {
    console.error('Error al leer el archivo package.json:', error.message);
  }
  console.log(colors.reset + '---------------------------\n');

  console.log(colors.fgCyan + colors.bright + '--- Verificación de actualizaciones ---' + colors.reset);
  try {
    const { stdout } = await exec('npm outdated --long --json');
  
    let data = '';
  
    stdout.on('data', (chunk) => {
      data += chunk;
    });
  
    stdout.on('end', () => {
      const trimmedStdout = data.trim();
  
      if (trimmedStdout === '') {
        console.log('Todos los paquetes están actualizados.');
      } else {
        console.log('Paquetes desactualizados:');
        console.log(trimmedStdout);
  
        rl.question('¿Deseas actualizar los paquetes? (y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            console.log(colors.fgYellow + 'Actualizando paquetes...' + colors.reset);
            await execAsync('npm update');
            console.log(colors.fgGreen + 'Paquetes actualizados exitosamente.' + colors.reset);
          } else {
            console.log('No se actualizarán los paquetes.');
          }
  
          rl.close();
        });
      }
    });
  } catch (error) {
    console.error('Error al verificar actualizaciones:', error.message);
  }
  console.log(colors.reset + '--------------------------------------\n');
}



async function runScript() {
  rl.question('Ingresa el nombre del script a ejecutar: ', async (scriptName) => {
    console.log(colors.fgCyan + colors.bright + `--- Ejecutando script: ${scriptName} ---` + colors.reset);
    try {
      await execAsync(`npm run ${scriptName}`);
      console.log(colors.fgGreen + colors.bright + `Script '${scriptName}' ejecutado exitosamente.` + colors.reset);
    } catch (error) {
      console.error(colors.fgRed + 'Error al ejecutar el script:' + colors.reset, error.message);
    }
    console.log(colors.reset + '--------------------------------------\n');
    main();
  });
}

async function startBot() {
  console.log(colors.fgCyan + colors.bright + '--- Iniciando el bot ---' + colors.reset);
  try {
    const botProcess = exec('node index.js');
    botProcess.stdout.pipe(process.stdout);
    botProcess.stderr.pipe(process.stderr);
    botProcess.on('exit', () => {
      console.log(colors.fgCyan + colors.bright + '--- El bot se ha detenido ---' + colors.reset);
      main();
    });
  } catch (error) {
    console.error(colors.fgRed + 'Error al iniciar el bot:' + colors.reset, error.message);
    main();
  }
}

function exit() {
  console.log(colors.fgCyan + 'Saliendo del lanzador.' + colors.reset);
  process.exit(0);
}


function main() {
 checkAndUpdateLauncher();
  console.log(colors.fgMagenta + colors.bright + 'Audio Tools' + colors.reset);
  console.log(colors.fgYellow + colors.bright + '--- Opciones disponibles ---' + colors.reset);
  console.log(colors.fgGreen + '1. Diagnóstico del sistema' + colors.reset);
  console.log(colors.fgGreen + '2. Ejecutar script personalizado' + colors.reset);
  console.log(colors.fgGreen + '3. Iniciar el bot' + colors.reset);
  console.log(colors.fgGreen + '4. Salir' + colors.reset);
  console.log(colors.reset + '---------------------------');

  rl.question(colors.fgYellow + 'Ingresa el número de la opción deseada: ' + colors.reset, (selectedOption) => {
    const actions = [runDiagnostics, runScript, startBot, exit];
    const selectedAction = parseInt(selectedOption) - 1;

    if (isNaN(selectedAction) || selectedAction < 0 || selectedAction >= actions.length) {
      console.log(colors.fgRed + 'Opción no válida. Por favor, selecciona una opción válida.' + colors.reset);
    } else {
      actions[selectedAction]();
    }
  });
}

main();

