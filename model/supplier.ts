import mongoose, { Schema, model, models, Document } from "mongoose";

/* ================= CONTACT ================= */
export interface ContactType {
  [key: string]: any;
}

const ContactSchema = new Schema<ContactType>({}, { strict: false });

/* ================= LOCATION ================= */
export interface LocationType {
  [key: string]: any;
}

const LocationSchema = new Schema<LocationType>({}, { strict: false });

/* ================= SUPPLIER ================= */
export interface SupplierType {
  [key: string]: any;
}

const SupplierSchema = new Schema<SupplierType>(
  {
    contact: [ContactSchema],
    location: LocationSchema,
  },
  { strict: false }
);

/* ================= SUPPLIER GROUP ================= */
export interface SupplierGroupType extends Document {
  [key: string]: any;
}

const SupplierGroupSchema = new Schema<SupplierGroupType>(
  {
    suppliers: [SupplierSchema],
  },
  { timestamps: true, strict: false }
);

/* ================= MODEL ================= */
export const SupplierModel =
  models.SupplierGroup ||
  model<SupplierGroupType>("SupplierGroup", SupplierGroupSchema);