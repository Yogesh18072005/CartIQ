import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  mrp: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String, trim: true }],
  category: { type: String, required: true, trim: true, maxlength: 80, index: true },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
