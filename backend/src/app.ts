import path from "path";
import favicon from "serve-favicon";
import compress from "compression";
import helmet from "helmet";
import cors from "cors";

import feathers from "@feathersjs/feathers";
import configuration from "@feathersjs/configuration";
import express from "@feathersjs/express";
import socketio from "@feathersjs/socketio";
import swagger from "feathers-swagger";

import { Application } from "./declarations";
import logger from "./logger";
import middleware from "./middleware";
import services from "./services";
import appHooks from "./app.hooks";
import channels from "./channels";
import authentication from "./authentication";
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get("public"), "favicon.ico")));
// Host the public folder
app.use(express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());
app.configure(
  swagger({
    docsPath: "/api/docs",
    uiIndex: true,
    specs: {
      info: {
        title: "Home Panel API",
        description: "API for Home Panel",
        version: "2.0.0",
      },
    },
  })
);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

app.get("/*", (_req: Request, res: { sendFile: (arg0: string) => void }) => {
  res.sendFile(path.join(app.get("public"), "index.html"));
});

app.set("trust proxy", true);

export default app;
