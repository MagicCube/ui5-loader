"use strict";

const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");

let loaderOptions = null;

function ui5Loader(source, map)
{
    this.cacheable();

    if (!source)
    {
        return this.callback(null, source, map);
    }

    loaderOptions = loaderUtils.parseQuery(this.query);
    if (!loaderOptions.sourceRoot)
    {
        loaderOptions.sourceRoot = "./";
    }
    const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    const filename = webpackRemainingChain[webpackRemainingChain.length - 1];

    let groups = source.match(/sap\.ui\.define\(".+]/);
    if (groups && groups.length > 0)
    {
        const definePart = groups[0];
        if (!definePart.endsWith("[]"))
        {
            groups = definePart.match(/\[(.+)\]/);
            if (groups && groups.length > 0)
            {
                const group = groups[1];
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
        }
    }

    this.callback(null, source, map);
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
        let relativePath = path.relative(path.dirname(sourceFilename), absPath);
        if (!relativePath.startsWith("."))
        {
            relativePath = "./" + relativePath;
        }
        relativePath = relativePath.replace(/\\/g, "/");
        return relativePath;
    }
    else
    {
        if (!modulePath.startsWith("sap/ui/base"))
        {
            console.warn(`WARN: Dependency "${modulePath}" of "${path.relative(sourceRoot, sourceFilename)}" is not found in ${sourceRoot}.`);
        }
        return null;
    }
}

module.exports = ui5Loader;
