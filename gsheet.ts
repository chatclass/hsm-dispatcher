import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import credenciais from "./gsheets-key.json";
import Schedule from "./schedule";

const SHEES_ID = "1d9XB_GJ_bkku8YjSpkpwJB19X0TnExnK9Uzs0oBMqxw";

export default class GoogleSheets {
  doc: GoogleSpreadsheet;
  sheet?: GoogleSpreadsheetWorksheet;
  constructor() {
    this.doc = new GoogleSpreadsheet(SHEES_ID);
  }
  async start(name: string) {
    try {
      await this.doc.useServiceAccountAuth({
        client_email: credenciais.client_email,
        private_key: credenciais.private_key.replace(/\\n/g, "\n"),
      });
      await this.doc.loadInfo();
      this.sheet = this.doc.sheetsByIndex.filter(
        (sheet) => sheet.title === name
      )[0];
    } catch (error) {
      console.error('Starting google sheets');
    }
  }
  async loadSchedules() {
    const rows = await this.sheet?.getRows(); // can pass in { limit, offset }
    if (!rows) return [];
    const schedules: Schedule[] = [];
    rows.forEach((row) => schedules.push(new Schedule(row)));
    return schedules;
  }
}
