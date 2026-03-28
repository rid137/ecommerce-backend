import { Request, Response, NextFunction } from "express";
import addressService from "../services/address.service";
import { Types } from "mongoose";
import { createdResponse, paginatedResponse, successResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../utils/authTypes";

class AddressController {
  // Get all addresses for authenticated user
    async getUserAddresses(req: AuthenticatedRequest, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const userId = req.user?._id
    
        const { addresses, pagination } = await addressService.getUserAddresses(userId!, page, size);
        paginatedResponse(res, addresses, pagination, "User addresses retrieved successfully");
    }

    // Get a single address by ID
    async getAddressById(req: Request, res: Response) {
        const address = await addressService.getAddressById(req.params.id);
        successResponse(res, address, "address retrieved successfully");
    }

    // Create a new address
    async createAddress(req: AuthenticatedRequest, res: Response) {
        // const { addressData } = req.body;
        const userId = req.user?._id
    
        // const address = await addressService.createAddress(userId!, addressData);
        const address = await addressService.createAddress(userId!, req.body);
        createdResponse(res, address, "Address created successfully");
    }

    // Update an address
    async updateAddress(req: Request, res: Response) {
        const address = await addressService.updateAddress(req.params.id, req.body);
        successResponse(res, address, "address updated successfully");
    }

    // Delete an address
    async deleteAddress(req: Request, res: Response) {
        const address = await addressService.deleteAddress(req.params.id);
        successResponse(res, address, "address deleted successfully");
    }

    // Set address as default
    async setDefaultAddress(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?._id

        const address = await addressService.setDefaultAddress(req.params.id, userId!);
        successResponse(res, address, "address set as default successfully");
    }
}

export default new AddressController();