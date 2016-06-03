const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");

module.exports = function(source)
{
    this.cacheable();

    const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    const filename = webpackRemainingChain[webpackRemainingChain.length - 1];

    const definePart = source.match(/sap\.ui\.define\(".+]/)[0];
    if (!definePart.endsWith("[]"))
    {
        const group = definePart.match(/\[(.+)\]/)[1];
        const loaderOptions = loaderUtils.parseQuery(this.query);
        const sourceRoot = path.resolve(loaderOptions.sourceRoot ? loaderOptions.sourceRoot : process.cwd());
        let dependencies = group.split(", ").map(d => d.replace(/"/g, ""));
        const requires = [];
        dependencies = dependencies.map(d => {
            let absPath = path.resolve(sourceRoot, "./" + d);
            if (!absPath.endsWith(".js"))
            {
                absPath += ".js";
            }
            if (!fs.existsSync(absPath))
            {
                return null;
            }
            const relPath = path.relative(path.dirname(filename), absPath);
            requires.push(`require("${relPath}")`);
            return relPath;
        });

        source = requires.join(";\n") + "\n" + source;
    }

    this.callback(null, source);
};
