import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  userType: { type: String, enum: ["Lawyer", "Admin"], default: "Lawyer" },
  resetToken: { type: String, default: null }, // Add reset token field
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export { User }

const dataSchema = new mongoose.Schema({
  inputPrompt: {
    type: String,
    required: true,
  },
  outputResponse: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Queries = mongoose.model("query", dataSchema);

export { Queries }

const caseSchema = new mongoose.Schema({
  applicantDetails: {
    name: { type: String, required: true },
    country: { type: String, required: true },
    caseId: { type: String, default: "Nil" },
  },
  caseSummary: {
    description: { type: String, required: true },
    rejectionHistory: { type: String, required: true },
    appealAttempts: { type: Number, default: 0 },
  },
  evidence: [
    {
      name: String,
      size: Number,
      data: Buffer, // Store PDF file as binary data
      contentType: String, // Store file type
    },
  ],
  eligibilityResults: {
    status: { type: String, enum: ["Eligible", "Ineligible"], required: true },
    feedback: { type: [String], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Case = mongoose.model("Case", caseSchema);
export { Case };

const ResultSchema = new mongoose.Schema({
  anonymizationPreference: { type: Boolean, required: true },
  complainant: {
    firstName: { type: String, required: true },
    familyName: { type: String, required: true },
    dob: { type: String, required: true },
    nationality: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
  },
  victim: {
    firstName: { type: String},
    familyName: { type: String},
    dob: { type: String},
    nationality: { type: String},
  },
  countriesInvolved: {
    countries: { type: String, required: true },
  },
  priorSubmissions: {
    hasSubmitted: { type: Boolean, required: true },
    details: { type: String },
  },
  interimMeasures: {
    isRequesting: { type: Boolean, required: true },
    details: { type: String },
  },
  facts: { type: String, required: true },
  lawyer: {
    firstName: { type: String, required: true },
    familyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  feedback: {
    content: { type: String },
  },
  result: {
    Section1: {
      name_of_committee: [{ type: String }],
    },
    Section9: {
      justification: [{ type: String }],
    },
    Section10: {
      facts_summary: [{ type: String }],
    },
    Section11: {
      supporting_claims: [{ type: String }],
    },
  },
  userId: { type: String, required: true },
  generatedAtIp: { type: String, required: true }, // New field for IP address
  timestamp: { type: Date, default: Date.now },
  location: { type: Object },

});

const Result = mongoose.model("Result", ResultSchema);

export {Result};

