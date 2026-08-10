// Load environment variables from .env file
require("dotenv").config();

import app from "./app";
import { connect } from "./config/db";

const PORT: number = Number(process.env.PORT) || 8000;

// Connect to the MongoDB database
connect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
