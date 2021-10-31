const mongoose = require("mongoose");
const models = require("../models/index");
const Borrower = models.Borrower;
const Donor = models.Donor;
const axios = require("axios");
const uuid4 = require("uuid4");
const convert = require("xml-js");

const donorController = {
  async donorOtp(req, res, next) {
    const { donorVID } = req.body;
    const txnId = uuid4();
    console.log("txnId: ", txnId);

    axios
      .post("https://stage1.uidai.gov.in/onlineekyc/getOtp/", {
        vid: donorVID,
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

  async donorOtpVerify(req, res, next) {
    const { donorVID, txnId, otp } = req.body;
    axios
      .post("https://stage1.uidai.gov.in/onlineekyc/getEkyc/", {
        vid: donorVID,
        otp,
        txnId,
      })
      .then((response) => {
        if (response.data.status === "Y") {
          const xml = response.data.eKycString;
          const result = convert.xml2json(xml, { compact: true, spaces: 4 });
          const result1 = JSON.parse(result);
          const poa = result1.KycRes.UidData.Poa;

          const addData = Donor.findOneAndUpdate(
            { donorVID },
            {
              poa: poa._attributes,
            }
          );
          addData.exec((err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.json({
                status: "success",
                message: "Donor data added successfully",
                data: result,
              });
            }
          });
        } else {
          const xml = response.data.eKycString;
          const result = convert.xml2json(xml, { compact: true, spaces: 4 });
          const result1 = JSON.parse(result);
          //const poa = result1.KycRes.UidData.Poa;
          console.log(result1);
          res.send(result1);
        }
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },

  async borrowerRequests(req, res, next) {
    const { donorVID } = req.body;
    try {
      const requests = await Borrower.find({ donorVID, status: "pending" });
      console.log(requests);
      res.json({
        status: "success",
        message: "All pending requests",
        data: requests,
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: "error",
        message: "Error fetching requests",
        data: err,
      });
    }
  },

  async replyRequest(req, res, next) {
    const { donorVID, borrowerVID, status } = req.body;
    try {
      const borrower = await Borrower.findOne({ borrowerVID });
      const donor = await Donor.findOne({ donorVID });
      if (borrower.status === "pending" && donor.status === "pending") {
        if (status === "accepted") {
          await Borrower.findOneAndUpdate(
            { borrowerVID },
            { status: "accepted", poa: donor.poa }
          );
          await Donor.findOneAndUpdate({ donorVID }, { status: "accepted" });
          res.json({
            status: "success",
            message: "Request accepted",
            data: {
              donor,
              borrower,
            },
          });
        } else if (status === "rejected") {
          await Borrower.findOneAndUpdate(
            { borrowerVID },
            { status: "rejected" }
          );
          await Donor.findOneAndUpdate({ donorVID }, { status: "rejected" });
          res.json({
            status: "success",
            message: "Request rejected",
            data: {
              donor,
              borrower,
            },
          });
        }
      } else {
        res.json({
          status: "error",
          message: "Request already accepted or rejected",
          data: {
            donor,
            borrower,
          },
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        status: "error",
        message: "Error updating request",
        data: err,
      });
    }
  },
};

module.exports = donorController;
