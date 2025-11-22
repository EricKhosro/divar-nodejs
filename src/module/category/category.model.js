const { Schema, Types, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    icon: { type: String, required: true },
    parent: { type: Types.ObjectId, required: false, ref: "category" },
    parents: {
      type: [Types.ObjectId],
      required: false,
      ref: "category",
      default: [],
    },
  },
  {
    virtuals: true,
    versionKey: false,
    id: false,
  }
);

CategorySchema.virtual("children", {
  ref: "category",
  localField: "_id",
  foreignField: "parent",
});

CategorySchema.set("toJSON", { virtuals: true });

function autoPopulate(next) {
  this.populate("children");
  next();
}
CategorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate);

const CategoryModel = model("category", CategorySchema);
module.exports = CategoryModel;
