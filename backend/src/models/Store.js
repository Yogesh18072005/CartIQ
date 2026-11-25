import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  username: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[a-z0-9-]{3,30}$/ },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  email: { type: String, required: true, trim: true, lowercase: true },
  contact: { type: String, required: true, trim: true, maxlength: 30 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  logoUrl: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
