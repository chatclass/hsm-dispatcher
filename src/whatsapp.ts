import axios, { AxiosInstance } from "axios";
import { Config } from './config';

const httpRequestConfig = {
	baseURL: 'https://waba.360dialog.io/v1',
	headers: { 'D360-API-KEY' : Config.whatsapp.beieditora.key },
};

export default class WhatsApp {
	instance: AxiosInstance = axios.create(httpRequestConfig);
	async post(hsm: any){
		return this.instance.post('', hsm)
	}
}