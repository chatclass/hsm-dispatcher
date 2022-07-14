import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Message } from "./message";

export default class Report {
  static async messages(sheet: GoogleSpreadsheetWorksheet, messages: Message[]){
    for(const message of messages){
      await sheet.addRow({
        course_id: message.courseId,
        status: message.status,
        phone: message.phone,
        client: message.client,
        template: message.template,
        sent_at: message.sentAt.toString(),
      })
    }
  }
}
