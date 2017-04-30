const semver = require('semver');
const packageConfig = require('../package.json');

function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim()
}

let versionRequirements = [
    {
        name: 'node',
        currentVersion: semver.clean(process.version),
        versionRequirement: packageConfig.engines.node
    },
    {
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    }
];

module.exports = function () {
    let warnings = [];

    versionRequirements.forEach((mod) => {
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(`${mod.name}: "${mod.currentVersion}" should be "${mod.versionRequirement}"`);
        }
    });

    if (warnings.length) {
        console.log('\nTo use this template, you must update following to modules:\n');

        warnings.forEach((warning) => {
            console.log(`  ${warning} \n`);
        });

        process.exit(1)
    }
};
