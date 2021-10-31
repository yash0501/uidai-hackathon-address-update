const mongoose = require("mongoose");
const models = require("../models/index");
const Borrower = models.Borrower;
const Donor = models.Donor;
const BorrowerNewAddress = models.BorrowerNewAddress;
const axios = require("axios");
const uuid4 = require("uuid4");
const convert = require("xml-js");

const borrowerController = {
  async home(req, res, next) {
    //console.log(req);
    console.log("Hello World");
    res.send("Hello World");
  },

  async borrowerCreateOtp(req, res, next) {
    const { borrowerVID } = req.body;
    const txnId = uuid4();
    console.log("txnId: ", txnId);

    axios
      .post("https://stage1.uidai.gov.in/onlineekyc/getOtp/", {
        vid: borrowerVID,
        txnId,
      })
      .then((response) => {
        console.log(response.data);
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },

  async borrowerVerifyOtp(req, res, next) {
    const { borrowerVID, otp, txnId } = req.body;

    axios
      .post("https://stage1.uidai.gov.in/onlineekyc/getAuth/", {
        vid: borrowerVID,
        otp,
        txnId,
      })
      .then((response) => {
        console.log(response.data);
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },

  async borrowerEkyc(req, res, next) {
    const { borrowerVID, txnId, otp } = req.body;
    axios
      .post("https://stage1.uidai.gov.in/onlineekyc/getEkyc/", {
        vid: borrowerVID,
        otp,
        txnId,
      })
      .then((response) => {
        if (response.data.status === "Y") {
          const xml = response.data.eKycString;
          console.log(xml);
          const result = convert.xml2json(xml, { compact: true, spaces: 4 });
          const result1 = JSON.parse(result);
          const poa = result1.KycRes.UidData.Poa;
          console.log(poa);
          res.send(poa);
        }
        const xml = response.data.eKycString;
        console.log(xml);
        const result = convert.xml2json(xml, { compact: true, spaces: 4 });
        const result1 = JSON.parse(result);
        console.log(result1);
        //console.log(response.data);
        res.send(result1);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },

  async createBorrower(req, res, next) {
    const { borrowerVID, borrower_mobile, donorVID, donor_mobile } = req.body;
    //console.log(req.body);
    const borrower = new Borrower({
      borrowerVID,
      borrower_mobile,
      donorVID,
      donor_mobile,
      status: "pending",
    });
    const donor = new Donor({
      borrowerVID,
      donorVID,
      borrower_mobile,
      donor_mobile,
      status: "pending",
    });
    try {
      const result = await borrower.save();
      const donorResult = await donor.save();
      console.log(result, donorResult);
      res.json({
        status: "success",
        message: "Borrower created successfully",
        data: result,
      });
    } catch (err) {
      res.json({
        status: "error",
        message: "Borrower Creation Failed",
        data: err,
      });
    }
  },

  async editAddress(req, res, next) {
    const {
      borrowerVID,
      country,
      dist,
      house,
      lm,
      loc,
      pc,
      state,
      street,
      vtc,
    } = req.body;
    const address = new BorrowerNewAddress({
      borrowerVID,
      country,
      dist,
      house,
      lm,
      loc,
      pc,
      state,
      street,
      vtc,
    });
    try {
      const result = await address.save();
      console.log(result);
      res.json({
        status: "success",
        message: "Address updated successfully",
        data: result,
      });
    } catch (err) {
      res.json({
        status: "error",
        message: "Address updation Failed",
        data: err,
      });
    }
  },
};

module.exports = borrowerController;
