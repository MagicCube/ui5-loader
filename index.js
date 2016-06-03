const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");

let loaderOptions = null;

function ui5Loader(source)
{
    this.cacheable();

    loaderOptions = loaderUtils.parseQuery(this.query);

    const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    const filename = webpackRemainingChain[webpackRemainingChain.length - 1];

    const definePart = source.match(/sap\.ui\.define\(".+]/)[0];
    if (!definePart.endsWith("[]"))
    {
        const group = definePart.match(/\[(.+)\]/)[1];
        let dependencies = group.split(", ").map(d => d.replace(/"/g, ""));
        const requires = [];

        dependencies = dependencies.map(d => {
            const absPath = resolveModule(d, filename);
            if (absPath !== null)
            {
                requires.push(`require("${absPath}");\n`);
            }
        });

        source = requires.join(";\n") + "\n" + source;
    }

    this.callback(null, source);
};

function resolveModule(modulePath, sourceFilename)
{
    const sourceRoot = path.resolve(loaderOptions.sourceRoot ? loaderOptions.sourceRoot : process.cwd());
    let absPath = path.resolve(sourceRoot, "./" + modulePath);
    if (!absPath.endsWith(".js"))
    {
        absPath += ".js";
    }
    if (fs.existsSync(absPath))
    {
        return absPath;
    }
    else
    {
        if (!modulePath.startsWith("sap/ui/"))
        {
            console.warn(`WARN: Dependency "${modulePath}" of "${path.relative(sourceRoot, sourceFilename)}" is not found in "${sourceRoot}".`);
        }
        return null;
    }
}

module.exports = ui5Loader;
