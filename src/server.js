import connectDB from "./config/db.js";
import { PORT } from "./config/env.js";
import app from "./app.js";
import logger from "./config/logger.js";

app.listen(PORT, "0.0.0.0", async () => {
  const db = await connectDB(process.env.MONGO_URI);

  //   console.log(`DB Connected: ${db}`);
  //   console.log(`Server running on http://localhost:${PORT}`);
  logger.info(`Database Connected ${db}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});


