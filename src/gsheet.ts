import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet
} from "google-spreadsheet";
import credenciais from "./gsheets-key.json";
import { Config } from "./config";
import { logger } from "./logger";
import Schedule from "./schedule";

const SHEET_ID = Config.gsheet.sheetId;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export default class GoogleSheets {
  doc: GoogleSpreadsheet;
  sheet?: GoogleSpreadsheetWorksheet;
  constructor() {
    this.doc = new GoogleSpreadsheet(SHEET_ID);
  }
  async start(name: string) {
    await delay(1000)
    try {
      await this.doc.useServiceAccountAuth({
        client_email: credenciais.client_email,
        private_key: credenciais.private_key.replace(/\\n/g, "\n"),
      });
      await this.doc.loadInfo();
      logger.debug(`Getting sheet: ${name}`)
      this.sheet = this.doc.sheetsByIndex.filter(
        (sheet) => sheet.title === name
      )[0];
    } catch (error) {
      logger.error('Starting google sheets');
    }
  }
  async loadSchedules() {
    logger.debug(`Getting table rows`)
    const rows = await this.sheet?.getRows(); // can pass in { limit, offset }
    logger.debug(`Fetched ${rows?.length} rows`)
    if (!rows) return [];
    const schedules: Schedule[] = [];
    rows.forEach((row) => schedules.push(new Schedule(row)));
    return schedules;
  }
}

