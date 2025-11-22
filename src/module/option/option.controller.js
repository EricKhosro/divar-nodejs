const autoBind = require("auto-bind");
const optionMeessages = require("./option.message");
const optionService = require("./option.service");
class OptionController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = optionService;
  }

  async create(req, res, next) {
    try {
      const {
        title,
        key,
        type,
        guide,
        category,
        enum: list,
        required,
      } = req.body;

      await this.#service.create({
        title,
        key,
        type,
        guide,
        category,
        enum: list,
        required,
      });

      res.status(201).json({
        message: optionMeessages.created,
      });
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const options = await this.#service.find();
      res.json(options);
    } catch (error) {
      next(error);
    }
  }
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const option = await this.#service.findById(id);
      res.json(option);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const {
        title,
        key,
        type,
        guide,
        category,
        enum: list,
        required,
      } = req.body;

      const option = await this.#service.updateById(id, {
        title,
        key,
        type,
        guide,
        category,
        enum: list,
        required,
      });
      res.json({ option, message: optionMeessages.optionUpdate });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.deleteById(id);
      res.json({
        message: optionMeessages.optionDelete,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const option = await this.#service.findByCategoryId(categoryId);
      res.json(option);
    } catch (error) {
      next(error);
    }
  }

  async findByCategorySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const option = await this.#service.findByCategorySlug(slug);
      res.json(option);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OptionController();
