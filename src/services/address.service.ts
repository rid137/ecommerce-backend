import Address from "../models/address.model";
import { BadRequest, NotFound } from "../errors/httpErrors";
import { Types } from "mongoose";
import { CreateAddressDTO } from "../dtos/createAddress.dto";

class AddressService {
  // Get all addresses for a user
    async getUserAddresses(userId: Types.ObjectId, page: number, size: number) {
        const perPage = size || 10;
        const currentPage = page || 1;

        // const addresses = await Address.find({ userId });

        const [addresses, total] = await Promise.all([
            Address.find({ userId })
            .skip((page - 1) * size)
            .limit(size),
            Address.countDocuments({ userId })
        ]);

        return {
            addresses,
            pagination: {
                currentPage,
                perPage,
                totalDocuments: total,
                totalPages: Math.ceil(total / perPage),
            },
        };
    }

    // Get a single address by ID
    async getAddressById(addressId: string) {
        const address = await Address.findById(addressId);
        if (!address) throw NotFound("Address not found");
        
        return address;
    }

    // Create a new address
    // async createAddress(userId: Types.ObjectId, addressData: CreateAddressDTO) {
    //     const address = new Address({
    //         userId,
    //         ...addressData,
    //     });

    //     const addresses = await Address.find({ userId });

    //     const isUserDefaultAddress = addresses.find(addr => addr.isDefault);
    //     console.log("isUserDefaultAddress", isUserDefaultAddress?.isDefault)
    //     // if user has a default addess, new one cannot be default
    //     if (isUserDefaultAddress?.isDefault === true) {
    //         throw BadRequest("User already has a default address. Please set this address as default after creation if needed.");
    //         // return
    //     }

    //     return await address.save();
    // }
    async createAddress(userId: Types.ObjectId, addressData: CreateAddressDTO) {
        const addresses = await Address.find({ userId });
        const hasDefaultAddress = addresses.some(addr => addr.isDefault);

        // Only block if the new address is trying to be default
        if (hasDefaultAddress && addressData.isDefault) {
            throw BadRequest("User already has a default address. Please set this address as default after creation if needed.");
        }

        const address = new Address({
            userId,
            ...addressData,
        });

        return await address.save();
    }

    // Update an address
    async updateAddress(
        addressId: string,
        // userId: Types.ObjectId,
        fields: Partial<CreateAddressDTO>
    )   {
        // // Verify the address belongs to the user
        // if (address.userId.toString() !== userId.toString()) {
        //     throw BadRequest("Unauthorized to update this address");
        // }

        const updated = await Address.findByIdAndUpdate(addressId, fields, { new: true });
        if (!updated) throw NotFound("Address not found");

        return updated;
    }

    // Delete an address
    async deleteAddress(addressId: string) {
        const removed = await Address.findByIdAndDelete(addressId);
        if (!removed) throw NotFound("Address not found");
        
        return removed;
    }

    // Set an address as default
    async setDefaultAddress(addressId: string, userId: Types.ObjectId) {
        const address = await Address.findById(addressId);
        if (!address) throw NotFound("Address not found");
        
        // if (address.userId.toString() !== userId.toString()) {
        //   throw BadRequest("Unauthorized to update this address");
        // }

        // Remove default flag from all user addresses
        await Address.updateMany({ userId }, { isDefault: false });

        // Set this address as default
        address.isDefault = true;
        return await address.save();
    }
}

export default new AddressService();