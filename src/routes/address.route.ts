import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import addressController from "../controllers/address.controller";

const router = express.Router();

// All address routes require authentication
router.use(authenticate);

// Get all addresses for user and create new address
router
  .route("/")
  .get(addressController.getUserAddresses)
  .post(addressController.createAddress);

// Get, update, delete a specific address
router
  .route("/:id")
  .get(addressController.getAddressById)
  .put(addressController.updateAddress)
  .delete(addressController.deleteAddress);

// Set an address as default
router.patch("/:id/default", addressController.setDefaultAddress);

export default router;