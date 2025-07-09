import Product from "../models/product.model";
import { Conflict, NotFound } from "../errors/httpErrors";
import { ProductFields } from "../dtos/createProduct.dto";
import { Types } from "mongoose";
import { UserDocument } from "../models/user.model";

class ProductService {
    async createProduct(fields: ProductFields) {
        const product = new Product(fields);
        await product.save();
        return product;
    }

    async updateProduct(id: string, fields: ProductFields) {
        const updated = await Product.findByIdAndUpdate(id, fields, { new: true });
        if (!updated) throw NotFound("Product not found");
        return updated;
    }

    async deleteProduct(id: string) {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) throw NotFound("Product not found");
        return deleted;
    }

    async fetchPaginatedProducts(keyword: string, page: number, size: number) {
        const perPage = size || 10;
        const currentPage = page || 1;

        const search = keyword
        ? {
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { brand: { $regex: keyword, $options: "i" } },
            ],
            }
        : {};

        const [products, total] = await Promise.all([
        Product.find(search)
            .populate("category")
            .populate({ path: "reviews.user", select: "-password" })
            .limit(size)
            .skip((page - 1) * size)
            .sort({ createdAt: -1 }),
        Product.countDocuments(search),
        ]);

        return {
            products,
            pagination: {
              currentPage,
              perPage,
              totalDocuments: total,
              totalPages: Math.ceil(total / perPage),
            },
          };
    }

    async fetchProductById(id: string) {
        const product = await Product.findById(id)
        .populate("category")
        .populate({ path: "reviews.user", select: "-password" });

        if (!product) throw NotFound("Product not found");
        return product;
    }

    async fetchAllProducts() {
        const products = Product.find({})
        .populate("category")
        .populate({ path: "reviews.user", select: "-password" })
        .limit(12)
        .sort({ createdAt: -1 });

        return products;
    }

    async addProductReview(productId: string, user: UserDocument, rating: number, comment: string) {
        const product = await Product.findById(productId);
        if (!product) throw NotFound("Product not found");

        const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === user._id.toString()
        );

        if (alreadyReviewed) throw Conflict("You have already reviewed this product");

        const review = {
            name: user.username,
            rating: Number(rating),
            comment,
            user: user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

        await product.save();
        return review;
    }

    async fetchTopProducts() {
        const products = Product.find({}).sort({ rating: -1 }).limit(4);
        return products;
    }

    async fetchNewProducts() {
        const products = Product.find({}).sort({ _id: -1 }).limit(5);
        return products
    }

    async filterProductsByCategoryAndPrice(checked: string[], radio: [number, number]) {
        const query: any = {};
        if (checked?.length) query.category = { $in: checked };
        if (radio?.length === 2) query.price = { $gte: radio[0], $lte: radio[1] };
 
        const products = Product.find(query).populate("category");
        return products
    }
}

export default new ProductService();