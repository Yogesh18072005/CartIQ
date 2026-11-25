import mongoose from "mongoose";
import Store from "../models/Store.js";

export async function updateStoreStatus(req, res) {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    return res.status(400).json({ success: false, message: "Invalid store ID." });
  }

  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be approved or rejected." });
  }

  const store = await Store.findByIdAndUpdate(
    req.params.storeId,
    { $set: { status, isActive: status === "approved" } },
    { new: true, runValidators: true }
  );

  if (!store) return res.status(404).json({ success: false, message: "Store not found." });
  res.json({ success: true, data: store });
}

export async function listAdminStores(req, res) {
  const allowedStatuses = ["pending", "approved", "rejected"];
  const status = allowedStatuses.includes(req.query.status) ? req.query.status : undefined;
  const filter = status ? { status } : {};
  const stores = await Store.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: stores });
}

export async function setStoreActive(req, res) {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    return res.status(400).json({ success: false, message: "Invalid store ID." });
  }
  if (typeof req.body.isActive !== "boolean") {
    return res.status(400).json({ success: false, message: "isActive must be a boolean." });
  }

  const store = await Store.findOneAndUpdate(
    { _id: req.params.storeId, status: "approved" },
    { $set: { isActive: req.body.isActive } },
    { new: true }
  );
  if (!store) return res.status(404).json({ success: false, message: "Approved store not found." });
  res.json({ success: true, data: store });
}
