import winston from "winston";
import "winston-daily-rotate-file";
import fs from 'fs';
import { NODE_ENV } from "./env.js";

// Create logs folder if not exists --->
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-combined.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d", // keep logs for 14 days
  // level: 'info', // bydefault the level is info they include both error of logger both
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-error.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "30d",  // keep error logs for 30 days
  level: "error",
});



const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    transport,
    errorTransport
  ],
});

// shows the error of info in terminal when it is development
if (NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
