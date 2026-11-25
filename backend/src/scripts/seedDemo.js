import mongoose from "mongoose";
import dotenv from "dotenv";
import Store from "../models/Store.js";
import Product from "../models/Product.js";

dotenv.config();

const demoProducts = [
  { name: "Fresh Royal Gala Apples", description: "Crisp apples for everyday snacking.", mrp: 120, price: 99, category: "Fruits" },
  { name: "Cavendish Bananas", description: "A bunch of naturally ripened bananas.", mrp: 60, price: 45, category: "Fruits" },
  { name: "Farm Fresh Toned Milk", description: "Fresh toned milk for daily use.", mrp: 34, price: 32, category: "Dairy" },
  { name: "Whole Wheat Bread", description: "Soft whole wheat bread for breakfast.", mrp: 55, price: 48, category: "Bakery" },
  { name: "Classic Salted Chips", description: "Crispy salted potato chips.", mrp: 30, price: 25, category: "Snacks" },
  { name: "Basmati Rice 1kg", description: "Long-grain basmati rice for daily meals.", mrp: 150, price: 129, category: "Grocery" }
];

async function seedDemo() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);

  const store = await Store.findOneAndUpdate(
    { ownerId: "cartiq-demo-seed" },
    {
      $set: {
        name: "CartIQ Demo Market",
        username: "cartiq-demo-market",
        description: "Sample storefront for local CartIQ development and demonstrations.",
        email: "demo@cartiq.local",
        contact: "0000000000",
        address: "Local development demo address",
        logoUrl: "",
        status: "approved",
        isActive: true
      }
    },
    { upsert: true, new: true, runValidators: true }
  );

  for (const item of demoProducts) {
    await Product.findOneAndUpdate(
      { store: store._id, name: item.name },
      { $set: { ...item, store: store._id, images: [], inStock: true } },
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log(`Seeded ${demoProducts.length} demo products into ${store.username}`);
  await mongoose.disconnect();
}

seedDemo().catch(async (error) => {
  console.error("Demo seed failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
