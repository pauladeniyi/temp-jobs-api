require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const jobRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const connectDB = require("./db/connect");
const authMiddleware = require("./middleware/authentication");

// extra security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss");
const rateLimiter = require("express-rate-limit");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 Minute
    max: 100, //100 requests per WindowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1", authRouter);
app.use("/api/v1", authMiddleware, jobRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () => {
      connectDB(process.env.MONGO_URI);
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
