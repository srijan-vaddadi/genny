import express from "express";
import path from "path";
import router from "./router";
import logger from "./logger"
import { GennyError } from "./errors";

const app = express();

app.use(express.json())
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

app.use("/api", router);
app.use(express.static("build/frontend"))
app.get('(/*)?', async (req, res) => {
  res.sendFile(path.join(__dirname, "../../build/frontend/index.html"));
});

app.use((err, req, res, next) => {
  const error = GennyError.from(err)
  error.send(res)
})

export async function start(port: string) {
  return new Promise<void>((resolve, reject) => {
    app.listen(port, () => { 
      resolve()
    }).on("error", err => {
      reject(err)
    });
  })
}

export default {
  ...app,
  start
};