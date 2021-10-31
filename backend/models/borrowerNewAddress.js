const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowerNewAddressSchema = new Schema(
  {
    borrowerVID: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model("BorrowerNewAddress", borrowerNewAddressSchema);
