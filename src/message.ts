import { AxiosInstance } from "axios";
import GoogleSheets from "./gsheet";
import { logger } from "./logger";
import Nuhub from "./nuhub";

type Input = {
  courseId: string;
  client: string;
  phone: number;
  template: any;
  httpClient: Nuhub;
  sentAt: Date;
  channel: string;
  instance: string;
}

export class Message{
  instance: string;
  channel: string;
  courseId: string;
  client: string;
  phone: number;
  template: any;
  httpClient: Nuhub;
  sentAt: Date;
  status: 'succes' | 'error' | 'not_sent';
  constructor(input: Input){
    Object.assign(this, {...input})
  }
  async send(){
    logger.debug(`Sending to ${this.phone} in instance ${this.instance} and channel ${this.channel}`)
    return this.httpClient
      .post(
        `/channel/internal/${this.instance}/${this.channel}`,
        this.template.build(this.phone)
      )
      .then(async () => {
        this.status = 'succes';
        return;
      })
      .catch(async () => {
        this.status = 'error';
        logger.error(`Sending to ${this.phone} in instance ${this.instance} and channel ${this.channel}`)
        return;
      });
  }
  drySend(){
    this.status = 'not_sent'
    logger.debug(`Dry sending to ${this.phone} in instance ${this.instance} and channel ${this.channel}`)
  }
}
