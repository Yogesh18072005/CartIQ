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
