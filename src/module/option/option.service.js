const autoBind = require("auto-bind");
const OptionModel = require("./option.model");
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const optionMessages = require("./option.message");
const categoryMessages = require("../category/category.message");
const { default: slugify } = require("slugify");
const categoryService = require("./../category/category.service");
const { isTrue } = require("../../common/utils/functions");

class OptionService {
  #model;
  #categoryService;

  constructor() {
    autoBind(this);
    this.#model = OptionModel;
    this.#categoryService = categoryService;
  }

  async create(optionDTO) {
    const category = await this.#categoryService.checkExistById(
      optionDTO.category
    );
    const key = slugify(optionDTO?.key, {
      replacement: "_",
      trim: true,
      lower: true,
    });
    await this.checkOptionKeyExistWithSameCategory(category._id, key);
    if (optionDTO?.enum && typeof optionDTO?.enum === "string")
      optionDTO.enum = optionDTO.enum.split(",");
    else if (!Array.isArray(optionDTO.enum)) optionDTO.enum = [];

    if (optionDTO?.required) optionDTO.required = isTrue(optionDTO.required);

    const option = await this.#model.create(optionDTO);
    return option;
  }

  async find() {
    return await this.#model
      .find({}, {}, { projection: { __v: 0 }, sort: { _id: -1 } })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
  }

  async findById(id) {
    return await this.#model.findById(id, {}, { projection: { __v: 0 } });
  }

  async updateById(id, optionDTO) {
    await this.#categoryService.checkExistById(optionDTO.category);

    if (optionDTO?.enum && typeof optionDTO?.enum === "string")
      optionDTO.enum = optionDTO.enum.split(",");
    else if (!Array.isArray(optionDTO.enum)) optionDTO.enum = [];

    if (optionDTO?.required) optionDTO.required = isTrue(optionDTO.required);

    if (optionDTO?.key) {
      optionDTO.key = slugify(optionDTO?.key, {
        replacement: "_",
        trim: true,
        lower: true,
      });
    }
    const option = await this.#model.findOneAndUpdate(
      { _id: id },
      { $set: optionDTO },
      {
        projection: { __v: 0 },
      }
    );

    if (!option) throw createHttpError.NotFound(optionMessages.notFound);
    return option;
  }

  async findByCategoryId(id) {
    if (!id || !isValidObjectId(id))
      throw new createHttpError.BadRequest(categoryMessages.notFound);
    return await this.#model.find({ category: id }, { __v: 0 });
  }

  async findByCategorySlug(slug) {
    if (!slug) throw new createHttpError.BadRequest(categoryMessages.notFound);
    const category = await this.#model.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $addFields: {
          categoryName: "$category.name",
          categorySlug: "$category.slug",
          categoryIcon: "$category.icon",
        },
      },
      {
        $project: {
          category: 0,
          __v: 0,
        },
      },
      {
        $match: {
          categorySlug: slug,
        },
      },
    ]);
    if (!category)
      throw new createHttpError.NotFound(categoryMessages.notFound);

    return category;
  }

  async deleteById(id) {
    if (!id)
      throw createHttpError.BadRequest(optionMessages.optionIdIsRequired);
    const option = await this.#model.findById(id);
    if (!option) throw createHttpError.NotFound(optionMessages.notFound);

    await this.#model.deleteOne({ _id: id });
    return null;
  }

  async checkOptionKeyExistWithSameCategory(category, key) {
    const doesExist = await this.#model.findOne({ category, key });
    if (doesExist)
      throw new createHttpError.Conflict(optionMessages.optionKeyAlreadyExists);
    return null;
  }
}

module.exports = new OptionService();
