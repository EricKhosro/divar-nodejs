const autoBind = require("auto-bind");
const categoryService = require("./category.service");
const categoryMessages = require("./category.message");

class CategoryController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = categoryService;
  }

  async create(req, res, next) {
    try {
      const { name, icon, slug, parent } = req.body;
      await this.#service.create({ name, icon, slug, parent });
      res.status(201).json({
        message: categoryMessages.created,
      });
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const categories = await this.#service.find();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.deleteById(id);
      res.json({ message: categoryMessages.deleted });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
