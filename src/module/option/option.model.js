const { Schema, Types } = require("mongoose");

const OptionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Types.ObjectId, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: { type: [Number], required: true },
  images: { type: [String], required: false, default: [] },
});
