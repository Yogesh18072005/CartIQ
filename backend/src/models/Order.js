import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  buyerId: { type: String, required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  address: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], default: "ORDER_PLACED" },
  paymentMethod: { type: String, enum: ["COD"], default: "COD" },
  paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
