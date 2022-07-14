import axios, { AxiosInstance } from "axios";
import { Config } from "./config";

export default class Nuhub {
  private client: AxiosInstance;
  constructor(){
    this.client = axios.create({
      baseURL: Config.nuhub.baseUrl,
    });
  }
  post(url: string, data?: any){
    return this.client.post(url, data)
  }
}
