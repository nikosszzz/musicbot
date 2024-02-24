import { defineConfig } from "rollup";
import { typescriptPaths as paths } from "rollup-plugin-typescript-paths";
import { execSync } from "node:child_process";
import version from "typescript";
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
    external: ["discord.js", "play-dl", "lyrics-finder", "spotify-url-info", "youtube-sr", "array-move", "string-progressbar", "undici", "@discordjs/voice", "chalk", "typescript", "node:util", "node:os", "node:process"],
    cache: true,
    output: {
        name: "bundle.js",
        file: "dist/bundle.js",
        dynamicImportInCjs: true,
        inlineDynamicImports: true,
        minifyInternalExports: true,
        compact: true,
        format: "cjs",
        strict: true,
        sourcemap: false,
    },
    plugins: [
        paths({ preserveExtensions: true, nonRelative: true }),
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
                __TYPESCRIPTVERSION__: `"${version.version}"`
            },
            treeShaking: true
        })
    ]
}]);