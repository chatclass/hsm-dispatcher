import SchedulerBatch from "./batch";
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
  template: {name: string, build: (phone: number) => any};
  phones: number[];
  chatclass: number[];
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const client = new Nuhub();

export async function Run(input: Input): Promise<{ success: number, errors: number}> {
  const result: any[] = [];
  logger.debug("Sending HSM batch");
  logger.debug('Batch data', {
    ...input,
    phones: input.phones.length,
    template_name: input.template.name,
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

export async function DryRun(input: Input) {
  const result: any[] = [];
  logger.debug("Sending HSM batch");
  logger.debug('Batch data', {
    ...input,
    phones: input.phones.length,
    template_name: input.template.name,
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
    if(SchedulerBatch.shouldStop()) {
      await Report.messages(gsheet.sheet, result)
      return {
        success: result.filter((message:Message) => message.status === 'succes').length,
        errors: result.filter((message:Message) => message.status === 'error').length,
      }
    }
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
    message.drySend();
    result.push(message);
  }
  await Report.messages(gsheet.sheet, result)
  return { 
    success: result.filter((message:Message) => message.status === 'succes').length,
    errors: result.filter((message:Message) => message.status === 'error').length,
  };
}
