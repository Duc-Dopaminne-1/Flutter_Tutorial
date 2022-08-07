const fs = require('fs');

function replaceEnvFile(source, destination) {
  try {
    const rootDir = process.cwd();
    const sourceFile = `${rootDir}/${source}`;
    const destFile = `${rootDir}/${destination}`;
    const data = fs.readFileSync(sourceFile, 'utf8');

    fs.writeFileSync(destFile, data, 'utf8');
  } catch (error) {
    console.error(error);
    process.exit(1); //error to not run next script command
  }
}

function replaceGraphqlEnv(env) {
  const folder = 'config/graphql/';
  replaceEnvFile(`${folder}/.env.${env}`, `${folder}/.env`);
}

module.exports = {replaceEnvFile, replaceGraphqlEnv};
