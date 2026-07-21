import { configDotenv } from "dotenv";

configDotenv();

const PORT = Number(process.env.PORT) || 8000 ;

export {
  PORT 
}