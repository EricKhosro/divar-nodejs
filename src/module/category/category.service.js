const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");
const OptionModel = require("../option/option.model");
const createHttpError = require("http-errors");
const categoryMessages = require("./category.message");
const { isValidObjectId, Types, default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");

class CategoryService {
  #model;
  #optionModel;

  constructor() {
    autoBind(this);
    this.#model = CategoryModel;
    this.#optionModel = OptionModel;
  }

  async create(categoryDTO) {
    if (!categoryDTO.parent) categoryDTO.parent = undefined;

    if (categoryDTO.parent && isValidObjectId(categoryDTO.parent)) {
      const parent = await this.checkExistById(categoryDTO.parent);
      categoryDTO.parents = [
        ...new Set([parent._id.toString()].concat(parent.parents)),
      ].map((id) => new Types.ObjectId(id));
    }
    const slug = slugify(categoryDTO?.slug || categoryDTO?.name);
    await this.checkSlugUniqueness(slug);
    categoryDTO.slug = slug;
    const category = await this.#model.create(categoryDTO);
    return category;
  }

  async find() {
    return await this.#model.find({ parent: { $exists: false } });
    // .populate([{ path: "children" }]);
  }

  async deleteById(id) {
    if (!id || !mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest(categoryMessages.invalidId);
    await this.#optionModel.deleteMany({ category: id });
    const deletedCategory = await this.#model.findByIdAndDelete(id).lean();

    if (!deletedCategory)
      throw createHttpError.NotFound(categoryMessages.notFound);

    return deletedCategory;
  }

  async checkExistById(id) {
    const category = await this.#model.findById(id);
    if (category) return category;
    throw createHttpError.NotFound(categoryMessages.notFound);
  }

  async checkExistBySlug(slug) {
    const category = this.#model.findOne({ slug });
    if (!category) throw createHttpError.NotFound(categoryMessages.notFound);
    return category;
  }

  async checkSlugUniqueness(slug) {
    const exists = await this.#model.findOne({ slug });
    if (exists)
      throw createHttpError.Conflict(categoryMessages.slugAlreadyExists);
    return true;
  }
}

module.exports = new CategoryService();
