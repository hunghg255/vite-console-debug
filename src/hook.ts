// import type { PluginOption } from 'vite';
// // Vite will call a series of hooks compatible with Rollup. This hook is mainly divided into three stages:
// // Server startup phase: options and buildStart hooks will be called when the service starts.
// // Request response phase: When the browser initiates a request, Vite internally calls resolveId, load and transform hooks in sequence.
// // Server shutdown phase: Vite will execute the buildEnd and closeBundle hooks in sequence.
// // In addition to the above hooks, other Rollup plug-in hooks (such as moduleParsed, renderChunk) will not be called during the Vite development stage. In the production environment, since Vite uses Rollup directly, all Rollup plug-in hooks in the Vite plug-in will take effect.
// export default function vitePlugin(options?): PluginOption {
//   console.log(options, 'obtained options');
//   return {
//     // Plug-in name
//     name: 'vite-plugin',

//     // pre will be executed before post
//     enforce: 'pre', // post

//     // Indicates that they are only called in 'build' or 'serve' mode
//     apply: 'build', // apply can also be a function

//     // 1. Vite's unique hook: you can modify vite's related configuration before vite is parsed. The hook receives the original user configuration config and a variable env that describes the configuration environment
//     config(config, { command }) {
//       console.log(config);
//     },

//     // 2. Vite unique hook: called after parsing the vite configuration. Use this hook to read and store the final resolved configuration. It's useful when a plugin needs to do something different depending on the command being run.
//     configResolved(resolvedConfig) {},

//     // 4. Vite's unique hook: mainly used to configure the development server and add custom middleware for dev-server (connect application)
//     configureServer(server) {},

//     // In front of 18. Vite's unique hook: a special hook for converting index.html. The hook receives the current HTML string and conversion context
//     transformIndexHtml(html) {},

//     // Vite's unique hook: perform custom HMR updates and send custom events to the client through ws
//     handleHotUpdate({ file, server }) {},

//     // 3. Common hooks in the build phase: called when the server starts: obtain and manipulate Rollup options
//     options(options) {},

//     // 5. Common hooks in the build phase: called when the server starts: called every time the build starts
//     buildStart(options) {},

//     // Generic hook for the build phase: called on every incoming module request: create a custom confirmation function that can be used to locate third-party dependencies
//     resolveId(source, importer, options) {},

//     // Universal hook in the build phase: called on every incoming module request: the loader can be customized and can be used to return customized content
//     load(id) {
//       console.log(id);
//     },

//     // Universal hook in the build phase: called on every incoming module request: called on every incoming module request, mainly used to convert a single module
//     transform(code, id) {},

//     // Universal hook in the build phase: called after the build is completed. The build here just represents the completion of all module escapes.
//     buildEnd() {},

//     // Output stage hook general hook: accept output parameters
//     outputOptions(options) {},

//     // Output stage hook universal hook: triggered every time bundle.generate and bundle.write are called.
//     renderStart(outputOptions, inputOptions) {},

//     // General hook for output stage hook: used to add hash to chunk
//     augmentChunkHash(chunkInfo) {},

//     // Output stage hook general hook: triggered when translating a single chunk. Rollup is called when outputting each chunk file.
//     renderChunk(code, chunk, options) {
//       return null;
//     },

//     // Output stage hook universal hook: trigger this hook immediately before calling bundle.write
//     generateBundle(options, bundle, isWrite) {},

//     // General hook for output stage hook: after calling bundle.write, after all chunks are written to the file, writeBundle will be called finally.
//     writeBundle(options, bundle) {},

//     // Generic hook: called when the server is shut down
//     closeBundle() {},
//   };
// }
