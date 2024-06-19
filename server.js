//server.js
import fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import https from "https";
import http from "http";
import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import express from "express";
import { isbot } from "isbot";

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import tailwind from "tailwindcss";
// This installs globals such as "fetch", "Response", "Request" and "Headers".
installGlobals();

/** @typedef {import('@remix-run/node').ServerBuild} ServerBuild */

const BUILD_PATH = path.resolve("build/index.js");
const VERSION_PATH = path.resolve("build/version.txt");

const initialBuild = await reimportServer();
const remixHandler =
  process.env.NODE_ENV === "development"
    ? await createDevRequestHandler(initialBuild)
    : createRequestHandler({
      build: initialBuild
    });

const app = express();

app.use((req,res,next)=>{
  if(!isbot(req.headers["user-agent"])) next();
})

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use("/test",(req,res)=>{
  let b = Buffer.from([]);
  req.on("data",(c)=>b=Buffer.concat([b,c]));
  req.on("end",()=>{
    console.log(`${b.toString()}`);
  })
  res.send("OK");
  return;
})

//handle route with express
app.use("/example/route",(req,res)=>{
  res.send("dog");
})

//expose some data to route context
app.use("/example/ip",
  createRequestHandler({
    build: initialBuild,
    getLoadContext: (req, res) => {
      return {ip:req.ip}
    }
  }));

//delegate handling to Remix
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
// const key = fs.readFileSync(path.join('./', 'host.key'));
// const cert = Buffer.concat([fs.readFileSync(path.join('./', 'host.crt')), fs.readFileSync(path.join('./', 'ca.crt'))])
// const httpsOptions= {
//   key: key,
//   cert:cert
// };

const server = http.createServer({},app);
// const server = https.createServer(httpsOptions, app);
server.listen(3000,"127.0.0.1",function () {
  console.log(`Express server listening at https://127.0.0.1:${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(initialBuild);
  }
});
/* app.listen(port, async () => {
  console.log(`Express server listening at http://localhost:${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(initialBuild);
  }
}); */

/**
 * @returns {Promise<ServerBuild>}
 */
async function reimportServer() {
  const stat = fs.statSync(BUILD_PATH);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + "?t=" + stat.mtimeMs);
}

async function buildStyles() {
    console.log(`[PostCSS] Build`);
    const css = await fs.promises.readFile('app/tailwind.css', "utf-8");
    const result =  await postcss([autoprefixer, tailwind]).process(css, { from: 'app/tailwind.css', to: 'public/style.css' });
    await fs.promises.writeFile('public/style.css', result.css);
    console.log("[PostCSS] Saved");
    if (result.map) {
        await fs.promises.writeFile('public/style.css.map', result.map.toString());
        console.log("Saved map");
    }
}

/**
 * @param {ServerBuild} initialBuild
 * @returns {Promise<import('@remix-run/express').RequestHandler>}
 */
async function createDevRequestHandler(initialBuild) {
  let build = initialBuild;
  async function handleServerUpdate() {
    buildStyles();
    // 1. re-import the server build
    build = await reimportServer();
    // 2. tell Remix that this app server is now up-to-date and ready
    broadcastDevReady(build);
  }
  const chokidar = await import("chokidar");
  chokidar
    .watch(VERSION_PATH, { ignoreInitial: true })
    .on("add", handleServerUpdate)
    .on("change", handleServerUpdate);

  // wrap request handler to make sure its recreated with the latest build for every request
  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
