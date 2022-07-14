import moment from "moment";
import { logger } from "./logger";
import { MetabaseRepo } from "./metabase";
import Schedule from "./schedule";

const BatchQueue = [];

enum BatchState {
  START = 'START',
  RUNNING = 'RUNNING',
  STOP = 'STOP',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
}

export default class SchedulerBatch {
  static state: BatchState = BatchState.START;
  metabase: MetabaseRepo;
  startedAt: Date;

  constructor() {
    this.metabase = new MetabaseRepo();
  }

  static isRunning(){
    if(BatchQueue.length > 0) return true;
    return false
  }

  static stop(){
    SchedulerBatch.state = BatchState.STOP
  }

  shouldStop(){
    return SchedulerBatch.state === BatchState.STOP
  }

  async run(data: { startedAt: Date }) {
    logger.debug("Starting new batch");
    if( SchedulerBatch.isRunning() ) { 
      logger.debug("One batch is alreadying running");
      return;
    }
    this.startedAt = data.startedAt;
    BatchQueue.push(this);
    logger.debug("Getting schedules data");
    const toRun = await this.schedulerListToRun();
    const result = await this.dispatch(toRun);
    logger.debug(`Dispatching result`, result)
    BatchQueue.pop();
    logger.debug("Finished");
  }

  async schedulerListToRun(){
    const schedules = await Schedule.getSchedule();
    logger.debug(`Filtering schedules: ${schedules.length}`);
    const toRun = schedules.filter((schedule) => {
      return schedule.date.isBefore(moment()) && !schedule.status;
    });
    logger.debug(`Remaining schedules: ${toRun.length}`);
    await Promise.all(toRun.map((schedule) => schedule.load(this.metabase)));
    const toRunTable = toRun.map((schedule) => ({
      name: schedule.client,
      hour: schedule.date,
    }));
    logger.debug('Schedules to run', toRunTable);
    return toRun; 
  }

  async dispatch(toRun: Schedule[]): Promise<{finished: boolean}> {
    logger.debug(`Dispatching schedules: ${toRun.length}`)
    for (const schedule of toRun) {
      if(this.shouldStop()) {
        logger.debug('Stopping dispatch')
        return {finished: false} 
      }
      logger.debug(`Running schedule:\ninstance:${schedule.instance}\ntemplate_name:${schedule.template}`)
      await schedule.run();
    }
    return {finished: true} 
  }
}

