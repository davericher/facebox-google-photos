const sade = require('sade');
const chalk = require('chalk');
const package = require('./package');
const {
    handleSeed
} = require('./src/faceboxSeed');


try {
    // Setup The Console Application
    sade(`${package.name} <name> <albumUrl> <faceboxUrl>`, true)
        .version(package.version)
        .describe(package.description)
        .example('"Dave Richer" https://photos.google.com/somePublicAlbum" "http://facebox:facebox@127.0.0.1:8089"')
        .example('"Dave Richer" https://photos.google.com/somePublicAlbum" "http://facebox:facebox@127.0.0.1:8089" -s')
        .option('-s, --state', 'Download the State File after training', false)
        .action(handleSeed)
        .parse(process.argv, {
            unknown: (arg) => `Unkown Option ${arg}`
        });
} catch (err) {
    console.error(chalk.red(`Something unrecoverable went wrong: ${err.message}`));
}
