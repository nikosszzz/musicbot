import { defineConfig } from "rollup";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { execSync } from "node:child_process";
import ts from "typescript";
import esbuild from 'rollup-plugin-esbuild';

function hash(): string {
    try {
        return execSync("git rev-parse --short HEAD").toString().trim();
    } catch (e: any | Error) {
        return "null";
    }
}

export default defineConfig([{
    input: "src/index.ts",
    treeshake: true,
    external: ["discord.js", "play-dl", "lyrics-finder", "array-move", "string-progressbar", "@discordjs/voice", "chalk", "typescript", "node:util", "node:os", "node:process"],
    cache: true,
    output: {
        name: "bundle.js",
        file: "dist/bundle.js",
        dynamicImportInCjs: true,
        inlineDynamicImports: true,
        minifyInternalExports: true,
        compact: true,
        format: "esm",
        strict: true,
        sourcemap: false,
    },
    plugins: [
        typescriptPaths({ preserveExtensions: true, nonRelative: true }),
        esbuild({
            platform: "node",
            target: "esnext",
            minify: true,
            minifyIdentifiers: true,
            minifySyntax: true,
            minifyWhitespace: true,
            mangleQuoted: true,
            ignoreAnnotations: true,
            define: {
                __VERSION__: `"${hash()}"`,
                __TYPESCRIPTVERSION__: `"${ts.version}"`
            },
            treeShaking: true
        })
    ]
}]);