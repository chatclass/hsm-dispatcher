import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import SchedulerBatch from "./batch";
import express from 'express';
import { Config } from "./config";
import { logger } from "./logger";

const app = express();

app.post('/run', (req, res) => {
  try{
    if(SchedulerBatch.isRunning()) return res.sendStatus(401);
    res.sendStatus(201)
    const batch = new SchedulerBatch();
    batch.run({ startedAt: new Date() });
  } catch(error){
    logger.error('Unhandled error at run', error)
    res.sendStatus(500)
  }
})

app.post('/dryrun', (req, res) => {
  try{
    if(SchedulerBatch.isRunning()) return res.sendStatus(401);
    res.sendStatus(201)
    const batch = new SchedulerBatch();
    batch.run({ startedAt: new Date() });
  } catch(error){
    logger.error('Unhandled error at dryrun', error)
    res.sendStatus(500)
  }
})

app.post('/stop', (req, res) => {
  try{
    SchedulerBatch.stop()
    res.sendStatus(200)
  } catch(error){
    logger.error('Unhandled error at stop', error)
    res.sendStatus(500)
  }
})

class Server {
  static start(){
    app.listen(Config.port, () => {
      logger.info(`Server listening at ${Config.port}`)
    })
  }
}

export default Server
