import mongoose from "mongoose";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import { getAuthenticatedUserId } from "../middleware/auth.js";

export async function listProducts(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const approvedStoreIds = await Store.find({ status: "approved", isActive: true }).distinct("_id");
  const filter = { inStock: true, store: { $in: approvedStoreIds } };

  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.search) filter.$text = { $search: String(req.query.search).slice(0, 100) };

  const [items, total] = await Promise.all([
    Product.find(filter).populate("store", "name username logoUrl").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function getProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }
  const product = await Product.findById(req.params.id)
    .populate("store", "name username logoUrl status isActive")
    .lean();

  if (!product || product.store?.status !== "approved" || !product.store?.isActive || !product.inStock) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: product });
}

async function getApprovedOwnerStore(userId) {
  return Store.findOne({ ownerId: userId, status: "approved", isActive: true });
}

export async function createProduct(req, res) {
  const userId = getAuthenticatedUserId(req);
  const store = await getApprovedOwnerStore(userId);
  if (!store) return res.status(403).json({ success: false, message: "An approved active store is required." });

  const product = await Product.create({ ...req.validatedBody, store: store._id });
  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req, res) {
  const userId = getAuthenticatedUserId(req);
  const store = await getApprovedOwnerStore(userId);
  if (!store) return res.status(403).json({ success: false, message: "An approved active store is required." });

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, store: store._id },
    { $set: req.validatedBody },
    { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ success: false, message: "Product not found for your store." });
  res.json({ success: true, data: product });
}

export async function deleteProduct(req, res) {
  const userId = getAuthenticatedUserId(req);
  const store = await getApprovedOwnerStore(userId);
  if (!store) return res.status(403).json({ success: false, message: "An approved active store is required." });

  const product = await Product.findOneAndDelete({ _id: req.params.id, store: store._id });
  if (!product) return res.status(404).json({ success: false, message: "Product not found for your store." });
  res.json({ success: true, message: "Product deleted" });
}
