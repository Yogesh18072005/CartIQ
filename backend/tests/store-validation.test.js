import test from "node:test";
import assert from "node:assert/strict";
import { createStoreSchema } from "../src/validators/store.js";

const validStore = {
  name: "Fresh Market",
  username: "fresh-market",
  description: "A neighborhood grocery store.",
  email: "owner@example.com",
  contact: "+911234567890",
  address: "Main Road, New Delhi",
  logoUrl: ""
};

test("accepts valid store details", () => {
  assert.equal(createStoreSchema.safeParse(validStore).success, true);
});

test("rejects unsafe store usernames", () => {
  const result = createStoreSchema.safeParse({ ...validStore, username: "Fresh Market!" });
  assert.equal(result.success, false);
});

test("rejects invalid email addresses", () => {
  const result = createStoreSchema.safeParse({ ...validStore, email: "not-an-email" });
  assert.equal(result.success, false);
});
