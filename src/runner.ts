import fs from "fs";
import converter from "json-2-csv";
import { Config } from "./config";
import GoogleSheets from "./gsheet";
import { logger } from "./logger";
import { Message } from "./message";
import Nuhub from "./nuhub";
import Report from "./report";

type Input = {
  channel: string;
  instance: string;
  cliente: string;
  courseId: string;
  template: (phone: number) => any;
  phones: number[];
  chatclass: number[];
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const client = new Nuhub();

export async function Run(input: Input) {
  const result: any[] = [];
  logger.debug("Sending HSM batch");
  logger.debug('Batch data', {
    ...input,
    phones: input.phones.length,
    template_name: input.template(12345).template.name,
  });
  await delay(1000)
  const gsheet = new GoogleSheets();
  await gsheet.start(Config.gsheet.tables.logs.name);
  for (const phone of input.chatclass) {
    const message = new Message({
      httpClient: client,
      courseId: input.courseId,
      client: input.cliente,
      phone: phone,
      template: input.template,
      channel: input.channel,
      sentAt: new Date(),
      instance: input.instance
    })
    await message.send();
    result.push(message);
  }
  for (const phone of input.phones) {
    // TODO: move rate limit to Nuhub class
    await delay(200)
    const message = new Message({
      httpClient: client,
      courseId: input.courseId,
      client: input.cliente,
      phone: phone,
      template: input.template,
      channel: input.channel,
      sentAt: new Date(),
      instance: input.instance
    })
    await message.send();
    result.push(message);
  }
  await Report.messages(gsheet.sheet, result)
  return;
}
