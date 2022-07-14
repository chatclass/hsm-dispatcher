import { GoogleSpreadsheetRow } from "google-spreadsheet";
import moment from "moment";
import { Config } from "./config";
import GoogleSheets from "./gsheet";
import { hsm } from "./hsm";
import { logger } from "./logger";
import { MetabaseRepo } from "./metabase";
import { DryRun, Run } from "./runner";
import Wapp11 from "./wapp11";

const METABASE_ID_REGEX = new RegExp(
  "https://metabase.chatclass.com.br/question/([0-9]*)(?=-)"
);

export default class Schedule {
  row: GoogleSpreadsheetRow;
  status: string;
  date: moment.Moment;
  channel: string;
  instance = "internal5571996600888";
  client: string;
  courseId: string;
  template: "activity_reminder";
  one: string;
  two: string;
  three: string;
  four?: string;
  metabaseCardId: string;
  onboardingStatus: 'ONBOARDED' | 'NOT_ONBOARDED';
  inactivityDays: number[] = [];
  phone_number: number[] = [];
  chatclass: number[];

  constructor(row: GoogleSpreadsheetRow) {
    this.row = row;
    this.channel = row.channel;
    this.client = row.client;
    this.courseId = row.course_id;
    this.template = row.template_name;
    this.one = row.var_1;
    this.two = row.var_2;
    this.three = row.var_3;
    this.four = row.var_4;
    this.metabaseCardId = row.metabase || "";
    this.status = row.status || "";
    this.inactivityDays.push(...row.inactivity_days.split(',').map((numb: string) => Number(numb)));
    this.onboardingStatus = row.onboarding_status;
    const date = row.schedule_date.split("-");
    const hour = row.schedule_hour.split("h");
    this.date = moment.utc(
      Date.UTC(2022, Number(date[0]) - 1, Number(date[1]), hour[0])
    );
    this.chatclass = row?.chatclass
      ? [...row.chatclass.split(",").map((phone: string) => Number(phone))]
      : [];
  }

  static async getSchedule(){
    const g = new GoogleSheets();
    logger.debug(`Starting gsheet tab: ${Config.gsheet.tables.schedules.name}`)
    await g.start(Config.gsheet.tables.schedules.name);
    logger.debug(`Table started: ${g.doc.title}`)
    const schedules = await g.loadSchedules();
    return schedules;
  }

  async load(metabase: MetabaseRepo) {
    const wapp11 = new Wapp11()
    const users = await wapp11.getUsers(
      [this.courseId],
      this.onboardingStatus,
      this.inactivityDays
    );
    this.phone_number = [
      ...users.map((user) => Number(user.whatsapp_id)),
    ];
    this.row.total = this.phone_number.length;
    await this.row.save();
}

  async run() {
    try {
      if (!this.one || !this.two || !this.three)
        throw new Error(`Missing hsm variable: 
          \n var_1: ${this.one} \n var_2: ${this.two} \n var_3: ${this?.three} \n var_4; ${this.four}`);
      if (
        this.status === "sent" ||
        this.status === "error" ||
        this.status !== ""
      )
        return;
      this.row.status = 'running';
      await this.row.save();
      await Run({
        channel: this.channel,
        instance: this.instance,
        cliente: this.client,
        courseId: this.courseId,
        template: hsm(this.one, this.two, this.three, this?.four)[
          this.template
        ],
        phones: [...this.phone_number],
        chatclass: [...this.chatclass]
      });
      this.row.status = "sent";
      await this.row.save();
    } catch (error) {
      console.error(error);
      this.row.status = "error";
      await this.row.save();
    }
  }

  async dryRun() {
    try {
      if (!this.one || !this.two || !this.three)
        throw new Error(`Missing hsm variable: 
          \n var_1: ${this.one} \n var_2: ${this.two} \n var_3: ${this?.three} \n var_4; ${this.four}`);
      if (
        this.status === "sent" ||
        this.status === "error" ||
        this.status !== ""
      )
        return;
      await DryRun({
        channel: this.channel,
        instance: this.instance,
        cliente: this.client,
        courseId: this.courseId,
        template: hsm(this.one, this.two, this.three, this?.four)[
          this.template
        ],
        phones: [...this.phone_number],
        chatclass: [...this.chatclass]
      });
      this.row.status = "sent";
      await this.row.save();
    } catch (error) {
      console.error(error);
      this.row.status = "error";
      await this.row.save();
    }
  }

}
