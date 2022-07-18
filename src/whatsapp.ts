import axios, { AxiosInstance } from "axios";
import { Config } from './config';

export default class WhatsApp {
	async post(phone: number, hsm: any){
		const instance: AxiosInstance = axios.create(hsm.config);
		console.log(hsm)
		return instance.post('/messages/', hsm.build(phone))
	}
}