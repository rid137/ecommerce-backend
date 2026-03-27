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

    async fetchPaginatedProducts(keyword: string, category: string, page: number, size: number) {
        const perPage = size || 10;
        const currentPage = page || 1;

        const search: any = {};

        if (keyword) {
            search.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { brand: { $regex: keyword, $options: "i" } },
            ];
        }

        if (category && Types.ObjectId.isValid(category)) {
            search.category = new Types.ObjectId(category);
        }

        const [products, total] = await Promise.all([
            Product.find(search)
                .populate("category")
                .populate({ path: "reviews.user", select: "-password" })
                .limit(perPage)
                .skip((currentPage - 1) * perPage)
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

// <div
//         onClick={() => {
//           screenwidth < 800 ? setopenMobileEdit(true) : null;
//           setEmployeeData(data);
//         }}
//         className="border-[1px] w-full border-light-grey lg:border-none rounded-8 lg:rounded-none relative employeelistTab
//          flex justify-between items-center  px-16 lg:px-32  py-16 my-24 lg:my-8 text-[14px] cursor-pointer hover:bg-[#F6F9FF]"
//       >
//         <Checkbox
//           className={`lg:w-[5%] ${
//             openChecks ? "lg:block" : "lg:hidden"
//           } hidden`}
//           onClick={() => setdeletionList([...deletionList, id])}
//         />
//         {/* <p className="lg:w-[10%]  lg:block hidden">
//           {moment(created_at).format("l")}
//         </p> */}
//         {/* <p className="lg:w-[10%]  lg:block hidden">
//           {moment(created_at).format("l")}
//         </p> */}
//         <p className="text-start lg:w-[18%] capitalize lg:block flex flex-col">
//           <p className="text-sm font-bold text-slate-700 group-hover:text-[#3B66FF] transition-colors uppercase">{first_name + " " + last_name}</p>
//           <p className="text-[10px] text-slate-400 font-medium tracking-tight">{employee_code}</p>
//         </p>
//         <Tooltip label={email} color="#295FFF" withArrow>
//           <p className="lg:w-[17%] text-start  lg:block hidden">
//             {truncateString(email, 23)}
//           </p>
//         </Tooltip>
//         <p className="lg:w-[10%] text-start font-500 text-sm">
//           {wallet_balance ? wallet_balance : "N/A"}
//         </p>
//         <p className="lg:w-[10%] text-start  font-500 text-sm uppercase">
//           {frequency ? frequency : "N/A"}
//         </p>
//         <p className="lg:w-[10%]  font-500 text-sm">
//           &#8358; {allocated_amount}
//         </p>
//         <p
//           className={`lg:w-fit  ${
//             is_active
//               ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
//               : "bg-slate-100 text-slate-500 border border-slate-200"
//           } lg:flex hidden  items-center rounded-[10px] py-[5px] px-12 text-12 uppercase`}
//         >
//           {is_active ? "Active" : "inactive"}
//         </p>

//         <Popover
//           width={397}
//           position="bottom-end"
//           withArrow
//           arrowPosition="side"
//           arrowOffset={67}
//           arrowSize={26}
//           shadow="lg"
//           opened={opened && walkthroughState === 3}
//           onChange={setOpened}
//         >
//           <Popover.Target>
//             <p
//               onClick={() => setopenMobileEdit(true)}
//               className="lg:w-[5%] lg:ml-16 lg:block hidden text-primary uppercase"
//             >
//               {/* <GrEdit /> */}
//               Edit
//             </p>
//           </Popover.Target>
//           {isFirst && walkthroughState === 3 && (
//             <Popover.Dropdown radius="md">
//               <div className="p-3 text-[#111]">
//                 <img src="/assets/icons/Icon2.png" alt="" />
//                 <p className="my-6 text-[14px] leading-[20px] w-[95%] ">
//                   Click on an employee to add an individual monthly spending
//                   limit.
//                 </p>
//                 <div className="flex justify-end items-center mt-2">
//                   <p
//                     onClick={() => {
//                       setOpened(false);
//                       initiatewalkthrough("COMPLETED");
//                     }}
//                     className="cursor-pointer text-[14px] text-right w-[50%] font-600"
//                   >
//                     Complete
//                   </p>
//                 </div>
//               </div>
//             </Popover.Dropdown>
//           )}
//         </Popover>

//         <p
//           className="lg:w-[5%]  lg:block hidden text-red-700 uppercase"
//           onClick={() => {
//             setOpenRemove(true);
//           }}
//         >
//           {/* <RiDeleteBin6Line color="red" size={20} /> */}
//           Delete
//         </p>
//       </div>