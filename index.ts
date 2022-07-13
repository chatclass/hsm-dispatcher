import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import GoogleSheets from "./gsheet";
import { MetabaseRepo } from "./metabase";
import moment from "moment";

class SchedulerBatch {
  metabase: MetabaseRepo;
  constructor() {
    this.metabase = new MetabaseRepo();
  }
  async run() {
    const g = new GoogleSheets();
    await g.start("Disparos");
    const schedules = await g.loadSchedules();
    console.log("Filtrando schedules a serem enviados");
    const toRun = schedules.filter((schedule) => {
      console.log(schedule.date);
      console.log(moment());
      return schedule.date.isBefore(moment()) && !schedule.status;
    });
    console.log("Carregando schedules data");
    await Promise.all(toRun.map((schedule) => schedule.load(this.metabase)));
    console.log(toRun.length);
    const toRunTable = toRun.map((schedule) => ({
      name: schedule.client,
      hour: schedule.date,
    }));
    console.table(toRunTable);
    for (const schedule of toRun) {
      await schedule.run();
    }
  }
}

const batch = new SchedulerBatch();
batch.run();
