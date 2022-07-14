import { Pool } from "pg";
import { Config } from "./config";
import { logger } from "./logger";
import userBaseQuery from "./wapp11-query";

export type PostgreSqlConfig = {
  uri: string;
  db: string;
  timeout?: {
    connection?: number;
    query?: number;
    statement?: false | number;
    idleInTransactionSession?: number;
  };
  pool?: {
    idleTimeoutMillis?: number;
    max?: number;
    min?: number;
  };
};

export default class Wapp11 {
  static client: Pool;
  protected config: PostgreSqlConfig = {
    uri: Config.wap11.database.uri,
    db: Config.wap11.database.name
  };
  protected makeConnectionString(): string {
    const url = new URL(this.config.uri);
    let path = url.pathname.replace(/\//g, '');
    if (path && this.config.db) {
      path = `${path}/${this.config.db}`;
    } else if (!path && this.config.db) {
      path = this.config.db;
    }
    return url.protocol + '//' + url.username + ':' + url.password + '@' + url.host + '/' + path + url.search;
  }
  getClient(){
    if(!Wapp11.client){
      const connectionString = this.makeConnectionString();
      console.log(connectionString)
      Wapp11.client = new Pool({
        connectionString: connectionString
      })
    }
    logger.debug(`Connecting to Wapp11`)
    return Wapp11.client.connect()
  }
  
  async getUsers(courseIds: string[], onboardingStatus: 'ONBOARDED' | 'NOT_ONBOARDED' = 'ONBOARDED', inactivityDays: any = [1,2]): Promise<any[]>{
    const client = await this.getClient()
    try{
      const query = userBaseQuery(courseIds, onboardingStatus, inactivityDays)
      const result = await client.query(query)
      return result.rows;
    } catch(error) {
      logger.error(`Error in query for course ids: ${courseIds}`, error)
      return [];
    }
  }
}

