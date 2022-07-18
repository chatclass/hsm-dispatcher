import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { logger } from "./logger";
import { Message } from "./message";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default class Report {
  static async messages(sheet: GoogleSpreadsheetWorksheet, messages: Message[]){
    for(const message of messages){
      await delay(1000)
      await sheet.addRow({
        course_id: message.courseId,
        status: message.status,
        phone: message.phone,
        client: message.client,
        template: message.template.name,
        sent_at: message.sentAt.toString(),
				error: typeof message.error === 'object' ? JSON.stringify(message.error) : message.error
				
      })
      logger.debug(`Saving message report for phone: ${message.phone}`)
    }
  }
	static async messagesScheduled(sheet: GoogleSpreadsheetWorksheet, messages: Message[]){
    for(const message of messages){
      await delay(1000)
      await sheet.addRow({
        course_id: message.courseId,
        status: message.status,
        phone: message.phone,
        client: message.client,
        template: message.template.name,
      })
      logger.debug(`Saving message report for phone: ${message.phone}`)
    }
	}
}
