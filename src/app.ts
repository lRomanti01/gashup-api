import express from "express";
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");
import path from "path";
import router from "./routes";
import swaggerSpec from "./swagger"
import swaggerUi from "swagger-ui-express"


const app: express.Application = express();

dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS
app.use(cors());

// app.use(morgan.default('dev'))
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", router);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(process.env.PORT, () => {
  console.log(`Server running on port  ${process.env.PORT}`);
});
