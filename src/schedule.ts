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
	datasource: string;
  onboardingStatus: 'ONBOARDED' | 'NOT_ONBOARDED';
  inactivityDays: number[] = [];
  phone_number: number[] = [];
  chatclass: number[];
	gsheet_id: string;
	users: string;

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
		this.datasource = row.datasource || 'wapp11'
		this.gsheet_id = row.gsheet_id;
    this.status = row.status || "";
		this.users = row.users;
    row.inactivity_days && this.inactivityDays.push(...row.inactivity_days.split(',').map((numb: string) => Number(numb)));
    this.onboardingStatus = row.onboarding_status;
    const date = row.schedule_date && row.schedule_date.split("-");
    const hour = row.schedule_hour && row.schedule_hour.split("h");
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
    const schedules = await g.loadSchedules();
    return schedules;
  }

  async load() {
		switch(this.datasource){
			case 'gsheet':
				this.phone_number = await this.getSheetUsers();
				this.row.total = this.phone_number.length;
				await this.row.save();
				return;
			case 'wap11':
				this.phone_number = await this.getWapp11Users();
				this.row.total = this.phone_number.length;
				await this.row.save();
				return;
			case 'metabase':
				this.phone_number = await this.getMetabaseUsers();
				this.row.total = this.phone_number.length;
				await this.row.save();
				return;
		}
	}

	async getMetabaseUsers(){
		const metabase: MetabaseRepo = new MetabaseRepo();
		const result = this.metabaseCardId.match(METABASE_ID_REGEX);
    if (!result || !result[1]) {
      this.phone_number = [
        ...this.metabaseCardId.split(",").map((phone) => Number(phone)),
      ];
      return;
    }
    return await metabase
      .getData({ metabaseCardId: result[1] })
      .then((phones: any) => {
        return phones ?
          phones.data.forEach((phone: { whatsapp_id: string }) => {
            this.phone_number.push(Number(phone.whatsapp_id));
          }) : []
      });
	}

	async getWapp11Users(){
    const wapp11 = new Wapp11()
    const users = await wapp11.getUsers(
      [this.courseId],
      this.onboardingStatus,
      this.inactivityDays
    );
		return [
      ...users.map((user) => Number(user.whatsapp_id)),
    ];
	}

	async getSheetUsers(){
		return this.users.split(';').map((phone) => Number(phone));
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
      this.row.status = "running";
      await this.row.save();
      const result = await Run({
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
      this.row.success = result?.success || result?.success;
      this.row.status = result.errors;
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
			this.row.status = "dry run";
			await this.row.save();
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
			this.row.success = "-";
      this.row.status = "-";
      this.row.status = "sent";
      await this.row.save();
    } catch (error) {
      console.error(error);
      this.row.status = "error";
      await this.row.save();
    }
  }

}
