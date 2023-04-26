require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var morgan = require("morgan");
const loggingHandler = require("./middleware/loggingHandler");

const swaggerDocs = require("./utils/swagger");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
const log = loggingHandler({ apiKey: "XYZ" });
app.use(express.json());
app.use(cors());
app.use(
  morgan(function (tokens, req, res) {
    if (req?.originalUrl.indexOf("/api") !== 0) return;
    log(req, res);
  })
);

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

  swaggerDocs(app, PORT);
});
