import mongoose from "mongoose";
import Address from "../models/Address.js";
import { getAuthenticatedUserId } from "../middleware/auth.js";

export async function listAddresses(req, res) {
  const data = await Address.find({ userId: getAuthenticatedUserId(req) }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
}

export async function createAddress(req, res) {
  const data = await Address.create({
    ...req.validatedBody,
    userId: getAuthenticatedUserId(req)
  });
  res.status(201).json({ success: true, data });
}

export async function deleteAddress(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid address ID." });
  }
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    userId: getAuthenticatedUserId(req)
  });
  if (!address) return res.status(404).json({ success: false, message: "Address not found." });
  res.json({ success: true, message: "Address deleted." });
}
