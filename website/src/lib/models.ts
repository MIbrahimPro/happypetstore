import mongoose, { Schema } from "mongoose";

const { Types } = mongoose;

/* ---------------- Product ---------------- */
const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand: String,
    category: {
      type: String,
      required: true,
      index: true,
      enum: ["food", "accessories", "toys", "litter", "grooming", "pharmacy"],
    },
    petTypes: [{ type: String, enum: ["dog", "cat", "bird", "small-pet"] }],
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    unit: { type: String, default: "piece" },
    stock: { type: Number, default: 0, min: 0 },
    lowStockAt: { type: Number, default: 3 },
    image: String,
    blurb: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* ---------------- StockMove: every stock change is logged ---------------- */
const StockMoveSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: "Product", required: true, index: true },
    productName: String,
    kind: {
      type: String,
      required: true,
      enum: ["restock", "sale", "adjust", "return", "damage"],
    },
    qty: { type: Number, required: true }, // positive or negative
    note: String,
    by: { type: String, default: "admin" },
  },
  { timestamps: true }
);

/* ---------------- Orders: WhatsApp carts become orders ---------------- */
const OrderItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema(
  {
    ref: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    note: String,
    channel: { type: String, default: "whatsapp" },
    status: {
      type: String,
      default: "new",
      index: true,
      enum: ["new", "confirmed", "packed", "delivered", "cancelled"],
    },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

/* ---------------- Customers: built from orders ---------------- */
const CustomerSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: String,
    address: String,
    petName: String,
    petType: String,
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: Date,
    tags: [{ type: String }],
  },
  { timestamps: true }
);

/* ---------------- Leads: adoption + vet call interest ---------------- */
const LeadSchema = new Schema(
  {
    kind: { type: String, required: true, enum: ["adoption", "vet", "general"], index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: String,
    status: {
      type: String,
      default: "new",
      index: true,
      enum: ["new", "contacted", "visited", "won", "lost"],
    },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

/* ---------------- Booking: clinic time slots ---------------- */
const BookingSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pet: String,
    reason: String,
    slot: { type: String, required: true },
    status: { type: String, default: "requested", enum: ["requested", "confirmed", "done", "cancelled"] },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const StockMove =
  mongoose.models.StockMove || mongoose.model("StockMove", StockMoveSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export type ProductDoc = mongoose.InferSchemaType<typeof ProductSchema>;
export type OrderDoc = mongoose.InferSchemaType<typeof OrderSchema>;
export type CustomerDoc = mongoose.InferSchemaType<typeof CustomerSchema>;
export type LeadDoc = mongoose.InferSchemaType<typeof LeadSchema>;
export type StockMoveDoc = mongoose.InferSchemaType<typeof StockMoveSchema>;
