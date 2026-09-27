import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __ht_mongo: Promise<typeof mongoose> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI missing");
  if (!global.__ht_mongo) {
    global.__ht_mongo = mongoose.connect(MONGODB_URI, { dbName: "happytails" });
  }
  return global.__ht_mongo;
}
