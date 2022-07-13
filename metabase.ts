import axios, { AxiosInstance } from "axios";

export class MetabaseWebservice {
  static metabaseKey: { id: string };
  private client: AxiosInstance;
  private metabaseConfig: any;

  constructor() {
    this.metabaseConfig = {
      baseUrl: process.env.METABASE_BASE_URL || "",
      userName: process.env.METABASE_USER_NAME || "",
      password: process.env.METABASE_USER_PASSWORD || "",
    };
    this.client = axios.create({
      baseURL: this.metabaseConfig.baseUrl,
      timeout: this.metabaseConfig.timeout,
    });
    console.log(this.metabaseConfig);
  }

  private async getSessionToken(): Promise<any> {
    return this.client
      .post("api/session", {
        username: this.metabaseConfig.userName,
        password: this.metabaseConfig.password,
      })
      .then((res) => {
        console.debug("[Metabase] fetch token");
        console.log(res.data);
        MetabaseWebservice.metabaseKey = res.data;
      })
      .catch(() => {
        console.error("[Error] Metabase fetch token");
      });
  }

  async post(url: string): Promise<any> {
    if (!MetabaseWebservice.metabaseKey?.id) await this.getSessionToken();
    this.client.defaults.headers.common["X-Metabase-Session"] =
      MetabaseWebservice.metabaseKey.id;
    const result = await this.client.post(url, null);
    return result;
  }
}

export class MetabaseRepo {
  client = new MetabaseWebservice();
  getData(s: { metabaseCardId: string }) {
    return this.client.post(`/api/card/${s.metabaseCardId}/query/json`);
  }
}
