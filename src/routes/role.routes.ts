import * as role from "../controllers/role.controller";

const { check } = require("express-validator");
import express = require("express");

const roleRouter: express.Router = express.Router();

roleRouter.post(
  "/createRol",
  [
    check("name", "the name is required").not().isEmpty(),
    check("code", "the code is required").not().isEmpty(),
  ],
  role.createRol
);

export default roleRouter;
