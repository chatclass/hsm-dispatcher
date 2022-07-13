import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

type Input = {
  courseId: string;
  status: "failed" | "success";
  phone: number;
  template: string;
  sendAt: Date;
};

export default class Report {
  courseId: string;
  status: "failed" | "success";
  phone: number;
  template: string;
  sendAt: Date;
  constructor(data: Input) {
    this.courseId = data.courseId;
    this.status = data.status;
    this.phone = data.phone;
    this.template = data.template;
    this.sendAt = data.sendAt;
  }
  save(sheet: GoogleSpreadsheetWorksheet){
    sheet.addRow({
      course_id: this.courseId,
      status: this.status,
      phone: this.phone,
      template: this.template,
      sendAt: this.sendAt.getUTCDate()
    })
  }
}
