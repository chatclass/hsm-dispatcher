import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import SchedulerBatch from "./batch";
import express from 'express';
import { Config } from "./config";
import { logger } from "./logger";

const app = express();

app.post('/run', async (req, res) => {
  try{
    if(SchedulerBatch.isRunning()) return res.sendStatus(400);
    res.sendStatus(201)
    const batch = new SchedulerBatch();
    await batch.run({ startedAt: new Date() });
    SchedulerBatch.setToStartState()
  } catch(error){
		SchedulerBatch.setToStartState()
    logger.error('Unhandled error at run', error)
  }
})

app.post('/dryrun', async (req, res) => {
  try{
    if(SchedulerBatch.isRunning()) return res.sendStatus(401);
    res.sendStatus(201)
    const batch = new SchedulerBatch();
    await batch.dryRun({ startedAt: new Date() });
    SchedulerBatch.setToStartState()
  } catch(error){
		SchedulerBatch.setToStartState()
		console.log(error)
    logger.error('Unhandled error at dryrun', error)
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
