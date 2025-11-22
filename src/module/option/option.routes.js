const { Router } = require("express");
const optionController = require("./option.controller");

const router = Router();

router.get("/", optionController.find);

router.get("/:id", optionController.findById);
router.delete("/:id", optionController.deleteById);
router.put("/:id", optionController.updateById);

router.get("/by-category/:categoryId", optionController.findByCategoryId);
router.get("/by-category-slug/:slug", optionController.findByCategorySlug);

router.post("/", optionController.create);

module.exports = {
  OptionRouter: router,
};
