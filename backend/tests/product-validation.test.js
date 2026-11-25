import test from "node:test";
import assert from "node:assert/strict";
import { productSchema } from "../src/validators/product.js";

const validProduct = {
  name: "Fresh apples",
  description: "A pack of fresh apples.",
  mrp: 100,
  price: 80,
  images: ["https://example.com/apple.png"],
  category: "Fruits",
  inStock: true
};

test("accepts a valid product", () => {
  assert.equal(productSchema.safeParse(validProduct).success, true);
});

test("rejects a product priced above its MRP", () => {
  const result = productSchema.safeParse({ ...validProduct, price: 120 });
  assert.equal(result.success, false);
});

test("rejects negative prices", () => {
  const result = productSchema.safeParse({ ...validProduct, price: -1 });
  assert.equal(result.success, false);
});

test("accepts a partial update without requiring every field", () => {
  const result = productSchema.partial().safeParse({ name: "Updated apples" });
  assert.equal(result.success, true);
});
