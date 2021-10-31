const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowerSchema = new Schema(
  {
    borrowerVID: {
      type: String,
      required: true,
    },
    borrower_mobile: {
      type: String,
      required: true,
    },
    donorVID: {
      type: String,
      required: true,
    },
    donor_mobile: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
    },
    poa: {},
    country: {
      type: String,
    },
    dist: {
      type: String,
    },
    house: {
      type: String,
    },
    lm: {
      type: String,
    },
    loc: {
      type: String,
    },
    pc: {
      type: String,
    },
    state: {
      type: String,
    },
    street: {
      type: String,
    },
    vtc: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Borrower", borrowerSchema);
