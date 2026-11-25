import Store from "../models/Store.js";
import { getAuthenticatedUserId } from "../middleware/auth.js";

export async function createStore(req, res) {
  const ownerId = getAuthenticatedUserId(req);
  const existing = await Store.findOne({ ownerId });
  if (existing) {
    return res.status(409).json({ success: false, message: "You already have a store application." });
  }

  const store = await Store.create({ ...req.validatedBody, ownerId });
  res.status(201).json({ success: true, data: store });
}

export async function getMyStore(req, res) {
  const ownerId = getAuthenticatedUserId(req);
  const store = await Store.findOne({ ownerId });
  res.json({ success: true, data: store });
}
