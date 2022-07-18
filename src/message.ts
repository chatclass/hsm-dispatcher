import { logger } from "./logger";
import WhatsApp from "./whatsapp";

type Input = {
  courseId: string;
  client: string;
  phone: number;
  template: any;
  httpClient: WhatsApp;
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
  httpClient: WhatsApp;
  sentAt: Date;
  status: 'succes' | 'error' | 'not_sent' | 'error_sending';
	error: string;
  constructor(input: Input){
    Object.assign(this, {...input})
  }
  async send(){
    logger.debug(`Sending to ${this.phone} in instance ${this.instance} and channel ${this.channel}`)
    console.log(this.template)
    return this.httpClient
      .post(
        this.phone, this.template
      )
      .then(async () => {
        this.status = 'succes';
        return;
      })
      .catch(async (err) => {
        this.status = 'error';
        logger.error(`Sending to ${this.phone} in instance ${this.instance} and channel ${this.channel}`)
				console.error(err.response.data)
				this.error = err.response?.data
        return;
      });
  }
  drySend(){
    this.status = 'not_sent'
    console.log(this.template)
    logger.debug(`Dry sending to ${this.phone} in instance ${this.instance} and channel ${this.channel}`)
  }
}
