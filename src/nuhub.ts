import axios, { AxiosInstance } from "axios";

export default class Nuhub {
  private client: AxiosInstance;
  constructor(){
    this.client = axios.create({
      baseURL: "http://localhost:3100/v1",
    });
  }
  post(url: string, data?: any){
    return this.client.post(url, data)
  }
}
