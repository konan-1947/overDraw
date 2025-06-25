// build.js
require('esbuild').build({
    entryPoints: ['js/main.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    format: 'iife', // classic JS, no import/export
    sourcemap: true,
    minify: false
}).catch(() => process.exit(1)); 