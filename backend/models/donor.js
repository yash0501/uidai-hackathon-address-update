const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema(
  {
    donorVID: {
      type: String,
      required: true,
    },
    donor_mobile: {
      type: String,
      required: true,
    },
    borrower_mobile: {
      type: String,
      required: true,
    },
    borrowerVID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
    },
    poa: {},
  },
  { timestamps: true }
);
//<Poa co=\"C/O: Jyothi\" country=\"India\" dist=\"Bengaluru\" house=\"#307, 3rdMain Road\" lm=\"Opposite to balaji \" loc=\"shiva nagar\ " pc=\"560043\" state=\"Karnataka\" street=\"Manjunatha nagar\" vtc=\"Horamavu\"/>
module.exports = mongoose.model("Donor", donorSchema);
