const { Router } = require("express");
const CategoryController = require("./category.controller");

const router = Router();
router.post("/", CategoryController.create);
router.get("/", CategoryController.find);
router.delete("/:id", CategoryController.deleteById);

module.exports = { CategoryRouter: router };
