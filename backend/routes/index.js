const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const borrowerController = controller.borrowerController;
const donorController = controller.donorController;

router.get("/", borrowerController.home);
router.post("/borrowerCreateOtp", borrowerController.borrowerCreateOtp);
router.post("/borrowerVerifyOtp", borrowerController.borrowerVerifyOtp);
router.post("/borrowerEkyc", borrowerController.borrowerEkyc);
router.post("/borrowRequest", borrowerController.createBorrower);
router.post("/editAddress", borrowerController.editAddress);

router.post("/donorOtp", donorController.donorOtp);
router.post("/donorOtpVerify", donorController.donorOtpVerify);
router.get("/borrowerRequests", donorController.borrowerRequests);
router.post("/replyRequest", donorController.replyRequest);

module.exports = router;
