const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/no-error", (_, res) => res.send("no errors"));

app.get("/sync-error", () => {
  throw Error("SYNCHRONOUS ERROR");
});

app.get("/async-error", async () => {
  throw Error("ASYNCHRONOUS ERROR");
});

app.get("/promise-reject", () => {
  return Promise.reject("PROMISE REJECTED");
});

app.get("/async-promise-reject", async () => {
  return Promise.reject("ASYNC PROMISE REJECTED");
});

const createHandler = (path, h) =>
  app.get(path, (req, res, next) => h(req, res, next).catch(next));

createHandler("/wrapped-async", async () => {
  throw Error("WRAPPED ASYNC ERROR");
});

const createHandler2 = (path, h) =>
  app.get(path, async (req, res, next) => {
    try {
      await h(req, res, next);
    } catch (e) {
      next(e);
    }
  });

createHandler2("/wrapped-async-2", async () => {
  throw Error("WRAPPED ASYNC ERROR 2");
});

app.use((err, req, res, next) => {
  console.log("defaultErrorHandler", err);
  res.send(`Error: ${err.message}`);
});

process.on("uncaughtException", (e) => {
  console.log("uncaughtException", e);
});

process.on("uncaughtRejection", (e) => {
  console.log("uncaughtRejection", e);
});

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
