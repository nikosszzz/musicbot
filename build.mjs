import { execSync } from "child_process";
import { version } from "typescript"
import { buildSync } from "esbuild";

function hash() {
    try {
        return execSync("git rev-parse --short HEAD").toString().trim();
    } catch (e) {
        return "null";
    }
}

try {
    console.log("Building Music Bot...");

    buildSync({
        entryPoints: ["src/index.ts"],
        bundle: true,
        packages: "external",
        platform: "node",
        target: "node22",
        format: "esm",
        minify: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,
        mangleQuoted: true,
        ignoreAnnotations: true,
        treeShaking: true,
        outfile: "dist/bundle.js",
        define: {
            __VERSION__: `"${hash()}"`,
            __TYPESCRIPTVERSION__: `"${version}"`
        },
    });
    
    console.log("Successfully built Music Bot!");
} catch (err) {
    console.error(`Failed to build Music Bot:\n ${err}`);
    process.exit(1);
}


if (process.argv.includes("--run")) {
    console.log("Running Music Bot bundle...");
    try {
        execSync("node ./dist/bundle.js", { stdio: "inherit" });
    } catch (_x) {
        console.log("Music Bot closed.");
    }
}