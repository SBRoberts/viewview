import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import dotenv from "rollup-plugin-dotenv";
import pkg from "./package.json";

import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const isProduction = process.env.NODE_ENV === "prod";

const rollupOptions = {
  input: "demo/src/app.js",
  plugins: [
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    dotenv(),
    typescript({
      tsconfig: "tsconfig.json",
    }), // so Rollup can convert TypeScript to JavaScript
  ],
  watch: {
    include: ["demo/src/**", "src/**"],
  },
  output: [
    {
      compact: false,
      file: `demo/dist/index.js`,
      format: "umd",
      sourcemap: true,
    },
  ],
};

if (!isProduction) {
  rollupOptions.plugins.push(
    serve({
      port: 3030,
      open: true,
      contentBase: "demo/dist",
      // TO TEST ON MOBILE COMMENT THIS IN AND REPLACE WITH YOUR COMPUTER'S IP
      // host: '192.168.0.160'
    })
  );
  rollupOptions.plugins.push(livereload());
}

export default [rollupOptions];
