import mongoose from "mongoose";

const uri: string =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_CLOUD
    : process.env.DATABASE;

export async function connect(): Promise<void> {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("DB connected");
    })
    .catch((e: any) => {
      console.error("DB connection error", e);
    });
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect().then(() => {
    console.log("DB disconnected");
  });
}
