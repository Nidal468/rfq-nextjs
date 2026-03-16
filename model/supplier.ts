import mongoose, { Schema, model, models, Document } from "mongoose"

/* ================= CONTACT ================= */

export interface ContactType {
  companyName: string
  uei: string | null
  email: string | null
  phone: string | null
}

const ContactSchema = new Schema<ContactType>({
  companyName: String,
  uei: String,
  email: String,
  phone: String
})

/* ================= LOCATION ================= */

export interface LocationType {
  countryCode: string
  countryName: string
  stateCode: string
  stateName: string
  cityName: string
  countyCode?: string | null
  countyName?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  addressLine3?: string | null
  congressionalCode?: string | null
  zip4?: string | null
  zip5?: string | null
  foreignPostalCode?: string | null
  foreignProvince?: string | null
}

const LocationSchema = new Schema<LocationType>({
  countryCode: String,
  countryName: String,
  stateCode: String,
  stateName: String,
  cityName: String,
  countyCode: String,
  countyName: String,
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
  congressionalCode: String,
  zip4: String,
  zip5: String,
  foreignPostalCode: String,
  foreignProvince: String
})

/* ================= SUPPLIER ================= */

export interface SupplierType {
  internalId: number
  recipientName: string
  recipientUEI: string | null

  contact: ContactType[]

  location: LocationType

  awardAmount: number
  awardId: string

  naics: {
    code: string
    description: string
  }

  psc: {
    code: string
    description: string
  }

  generatedInternalId: string
}

const SupplierSchema = new Schema<SupplierType>({
  internalId: Number,
  recipientName: { type: String, index: true },
  recipientUEI: { type: String, index: true },

  contact: [ContactSchema],

  location: LocationSchema,

  awardAmount: Number,
  awardId: String,

  naics: {
    code: { type: String, index: true },
    description: String
  },

  psc: {
    code: { type: String, index: true },
    description: String
  },

  generatedInternalId: { type: String }
})

/* ================= SUPPLIER GROUP ================= */

export interface SupplierGroupType extends Document {
  source: string
  naicsCode: string
  naicsDescription: string

  pscCode: string
  pscDescription: string

  nsn?: string | null

  solicitationNumber: string
  contractType: string

  agency: string
  subAgency?: string
  majorCommand?: string | null

  placeOfPerformance?: string | null
  deliveryDate?: string | null

  smallBusinessOnly?: boolean | null

  suppliers: SupplierType[]

  createdAt: Date
  updatedAt: Date
}

const SupplierGroupSchema = new Schema<SupplierGroupType>(
  {
    source: { type: String },
    naicsCode: { type: String, index: true },
    naicsDescription: String,

    pscCode: { type: String, index: true },
    pscDescription: String,

    nsn: String,

    solicitationNumber: { type: String, index: true },
    contractType: String,

    agency: { type: String, index: true },
    subAgency: String,
    majorCommand: String,

    placeOfPerformance: String,
    deliveryDate: String,

    smallBusinessOnly: Boolean,

    suppliers: [SupplierSchema]
  },
  { timestamps: true }
)

/* ================= MODEL ================= */

export const SupplierModel =
  models.SupplierGroup ||
  model<SupplierGroupType>("SupplierGroup", SupplierGroupSchema)