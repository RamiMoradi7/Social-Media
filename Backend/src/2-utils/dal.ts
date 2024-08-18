import mongoose from "mongoose";
import { appConfig } from "./app-config";

// DAL = Data Access Layer - The only one accessing the database.
class DAL {
  public async connect() {
    try {
      const db = await mongoose.connect(appConfig.mongodbConnectionString);
      console.log(`We're connected on ${db.connections[0].name}`);
    } catch (err: any) {
      console.error(err.message);
    }
  }
}

export const dal = new DAL();
