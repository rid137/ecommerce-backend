import { ProductFields } from "../dtos/createProduct.dto";
import asyncHandler from "../middlewares/asyncHandler";
import Product from "../models/productModel";
import { BadRequest, NotFound, Conflict } from "../errors/httpErrors";
import { successResponse, createdResponse, paginatedResponse } from "../utils/apiResponse";

interface ProductReviewInput {
  rating: number;
  comment: string;
}

interface FilterProductsInput {
  checked: string[];
  radio: [number, number];
}

const addProduct = asyncHandler(async (req, res) => {
  const fields = req.body as ProductFields;
  const { name, description, price, category, quantity, brand, images } = fields;

  // Validate required fields
  if (!name?.trim()) throw BadRequest("Name is required");
  if (!brand?.trim()) throw BadRequest("Brand is required");
  if (!description?.trim()) throw BadRequest("Description is required");
  if (!price) throw BadRequest("Price is required and must be a number");
  if (!category) throw BadRequest("Category reference is required");
  if (!quantity) throw BadRequest("Quantity is required");
  if (!images || images.length === 0) throw BadRequest("At least one product image is required");

  const product = new Product({ ...req.body });
  await product.save();
  
  createdResponse(res, product, "Product created successfully");
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const fields = req.body;
  const { name, description, price, category, quantity, brand } = fields;

  // Validate all required fields for update
  if (!name?.trim()) throw BadRequest("Name is required");
  if (!brand?.trim()) throw BadRequest("Brand is required");
  if (!description?.trim()) throw BadRequest("Description is required");
  if (!price) throw BadRequest("Price is required");
  if (!category) throw BadRequest("Category is required");
  if (!quantity) throw BadRequest("Quantity is required");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!product) throw NotFound("Product not found");
  successResponse(res, product, "Product updated successfully");
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw NotFound("Product not found");
  
  successResponse(res, product, "Product deleted successfully");
});

const fetchPaginatedProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } },
          { brand: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    Product.find({ ...keyword })
      .populate("category")
      .populate({ path: "reviews.user", select: "-password" })
      .limit(size)
      .skip((page - 1) * size)
      .sort({ createdAt: -1 }),
    Product.countDocuments({ ...keyword })
  ]);

  paginatedResponse(res, products, {
    currentPage: page,
    perPage: size,
    totalDocuments: total,
    totalPages: Math.ceil(total / size),
  }, "Products retrieved successfully");
});

 // MongoDB’s .find() doesn't allow text searching in populated fields like category.name, but we can use the aggregation pipeline to achieve this.
 // const fetchPaginatedProducts = asyncHandler(async (req, res) => {
 //   const page = parseInt(req.query.page as string) || 1;
 //   const size = parseInt(req.query.size as string) || 6;
 //   const keyword = (req.query.keyword as string)?.trim(); // Trim whitespace
 //   // Only proceed with aggregation if we actually need to search in populated fields
 //   if (keyword) {
 //     const matchStage = {
 //       $or: [
 //         { name: { $regex: keyword, $options: "i" } },
 //         { description: { $regex: keyword, $options: "i" } },
 //         { brand: { $regex: keyword, $options: "i" } },
 //         { "category.name": { $regex: keyword, $options: "i" } },
 //       ],
 //     };

 //     // Single aggregation using facet for better performance
 //     const [result] = await Product.aggregate([
 //       {
 //         $lookup: {
 //           from: "categories",
 //           localField: "category",
 //           foreignField: "_id",
 //           as: "category",
 //         },
 //       },
 //       { $unwind: "$category" },
 //       { $match: matchStage },
 //       {
 //         $facet: {
 //           data: [
 //             { $sort: { createdAt: -1 } },
 //             { $skip: (page - 1) * size },
 //             { $limit: size },
 //           ],
 //           meta: [
 //             { $count: "total" }
 //           ]
 //         }
 //       }
 //     ]);
 //     const products = result.data;
 //     const totalCount = result.meta[0]?.total || 0;
 //     return res.json({
 //       data: products,
 //       meta: {
 //         currentPage: page,
 //         perPage: size,
 //         totalDocuments: totalCount,
 //         totalPages: Math.ceil(totalCount / size),
 //       },
 //     });
 //   }
 // Fallback to simpler query when not searching populated fields
 //   const totalDocuments = await Product.countDocuments({});
 //   const products = await Product.find({})
 //     .populate("category")
 //     .sort({ createdAt: -1 })
 //     .skip((page - 1) * size)
 //     .limit(size);

 //   res.json({
 //     data: products,
 //     meta: {
 //       currentPage: page,
 //       perPage: size,
 //       totalDocuments,
 //       totalPages: Math.ceil(totalDocuments / size),
 //     },
 //   });
 // });

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate({ path: "reviews.user", select: "-password" });

  if (!product) throw NotFound("Product not found");
  successResponse(res, product, "Product retrieved successfully");
});

const fetchAllProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({})
    .populate("category")
    .populate({ path: "reviews.user", select: "-password" })
    .limit(12)
    .sort({ createdAt: -1 });
  
  successResponse(res, products, "Products retrieved successfully");
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment }: ProductReviewInput = req.body ?? {};
  const product = await Product.findById(req.params.id);

  if (!product) throw NotFound("Product not found");

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) throw Conflict("You have already reviewed this product");

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  createdResponse(res, review, "Review added successfully");
});

const fetchTopProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(4);
  
  successResponse(res, products, "Top products retrieved successfully");
});

const fetchNewProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find()
    .sort({ _id: -1 })
    .limit(5);
  
  successResponse(res, products, "New products retrieved successfully");
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked, radio }: FilterProductsInput = req.body;
  const query: Record<string, any> = {};

  if (checked?.length > 0) {
    query.category = { $in: checked };
  }

  if (radio?.length === 2) {
    query.price = { $gte: radio[0], $lte: radio[1] };
  }

  const products = await Product.find(query)
    .populate("category");
    
  successResponse(res, products, "Filtered products retrieved successfully");
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchPaginatedProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};