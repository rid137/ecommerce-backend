// import swaggerJSDoc from "swagger-jsdoc";

// const options: swaggerJSDoc.Options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "E-Commerce API Documentation",
//       version: "1.0.0",
//       description: "API documentation for the ExpressJS E-commerce project",
//     },
//     servers: [
//       {
//         url: "http://localhost:8600/api",
//         description: "Development server",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//       schemas: {
//         User: {
//           type: "object",
//           properties: {
//             _id: { type: "string" },
//             username: { type: "string" },
//             email: { type: "string" },
//             isAdmin: { type: "boolean" },
//             isVerified: { type: "boolean" },
//           },
//         },
//         Product: {
//           type: "object",
//           properties: {
//             name: { type: "string" },
//             price: { type: "number" },
//             brand: { type: "string" },
//             quantity: { type: "number" },
//             description: { type: "string" },
//             images: { type: "array", items: { type: "string" } },
//             category: { type: "string" },
//           },
//         },
//         Order: {
//           type: "object",
//           properties: {
//             orderItems: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
//             shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
//             totalPrice: { type: "number" },
//             isPaid: { type: "boolean" },
//           },
//         },
//         OrderItem: {
//           type: "object",
//           properties: {
//             name: { type: "string" },
//             qty: { type: "number" },
//             image: { type: "string" },
//             price: { type: "number" },
//             product: { type: "string" },
//           },
//         },
//         ShippingAddress: {
//           type: "object",
//           properties: {
//             address: { type: "string" },
//             city: { type: "string" },
//             postalCode: { type: "string" },
//             country: { type: "string" },
//           },
//         },
//       },
//     },
//   },
//   // This tells swagger-jsdoc where to look for the @swagger tags
//   apis: ["./src/docs/*.yaml", "./src/routes/*.ts"], 
// };

// export const specs = swaggerJSDoc(options);

import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description: "API documentation with strict error and response types.",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "jwt" },
      },
      schemas: {
        // MATCHES: ApiResponseBase interface
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
        // MATCHES: errorHandler.ts output
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: { type: "string", example: "Invalid credentials" },
                statusCode: { type: "number", example: 401 },
                code: { 
                  type: "string", 
                  enum: ["ERR_VALID", "ERR_AUTH", "ERR_FORBIDDEN", "ERR_NF", "ERR_CONFLICT", "ERR_UNPROCESSABLE", "ERR_INTERNAL"],
                  example: "ERR_AUTH" 
                },
              },
            },
          },
        },
        // REUSABLE RESPONSES - Mapped to your httpErrors.ts
        responses: {
            BadRequest: {
            description: "Bad Request - Validation Error",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Bad request", statusCode: 400, code: "ERR_VALID" } }
            } }
            },
            Unauthorized: {
            description: "Unauthorized - Auth Token Missing/Invalid",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Unauthorized", statusCode: 401, code: "ERR_AUTH" } }
            } }
            },
            Forbidden: {
            description: "Forbidden - Insufficient Permissions",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Forbidden", statusCode: 403, code: "ERR_FORBIDDEN" } }
            } }
            },
            NotFound: {
            description: "Not Found - Resource does not exist",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Not found", statusCode: 404, code: "ERR_NF" } }
            } }
            },
            Conflict: {
            description: "Conflict - Resource already exists",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Conflict", statusCode: 409, code: "ERR_CONFLICT" } }
            } }
            },
            UnprocessableEntity: {
            description: "Unprocessable Entity - Logic/Validation error",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Unprocessable entity", statusCode: 422, code: "ERR_UNPROCESSABLE" } }
            } }
            },
            InternalServerError: {
            description: "Internal Server Error",
            content: { "application/json": { 
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: { message: "Internal server error", statusCode: 500, code: "ERR_INTERNAL" } }
            } }
            },
        },
        // Entity: User Data returned in Login/Register
        UserAuthData: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a123..." },
            username: { type: "string", example: "johndoe" },
            email: { type: "string", example: "john@example.com" },
            isAdmin: { type: "boolean", example: false },
            isVerified: { type: "boolean", example: true },
          },
        },
        // Add these inside components.schemas in src/docs/swagger.ts
        Review: {
            type: "object",
            properties: {
                name: { type: "string" },
                rating: { type: "number" },
                comment: { type: "string" },
                user: { type: "string", description: "User ID" },
                createdAt: { type: "string", format: "date-time" }
            }
        },
        Product: {
            type: "object",
            properties: {
                _id: { type: "string" },
                name: { type: "string" },
                images: { type: "array", items: { type: "string" } },
                brand: { type: "string" },
                quantity: { type: "number" },
                category: { type: "string", description: "Category ID or Populated Category object" },
                description: { type: "string" },
                reviews: { type: "array", items: { $ref: "#/components/schemas/Review" } },
                rating: { type: "number" },
                numReviews: { type: "number" },
                price: { type: "number" },
                countInStock: { type: "number" },
                createdAt: { type: "string", format: "date-time" }
            }
        },
        Category: {
            type: "object",
            properties: {
                _id: { type: "string", example: "65a123..." },
                name: { type: "string", example: "Electronics" }
            }
        },

        // ORDER
        // Inside src/docs/swagger.ts components.schemas
        Order: {
            type: "object",
            properties: {
                _id: { type: "string" },
                user: { type: "string", description: "User ID or Populated User object" },
                orderItems: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                    name: { type: "string" },
                    qty: { type: "number" },
                    image: { type: "string" },
                    price: { type: "number" },
                    product: { type: "string", description: "Product ID" }
                    }
                }
                },
                shippingAddress: {
                type: "object",
                properties: {
                    address: { type: "string" },
                    city: { type: "string" },
                    postalCode: { type: "string" },
                    country: { type: "string" }
                }
                },
                paymentMethod: { type: "string", example: "PayPal" },
                paymentResult: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    status: { type: "string" },
                    update_time: { type: "string" },
                    email_address: { type: "string" }
                }
                },
                itemsPrice: { type: "number" },
                taxPrice: { type: "number" },
                shippingPrice: { type: "number" },
                totalPrice: { type: "number" },
                isPaid: { type: "boolean" },
                paidAt: { type: "string", format: "date-time" },
                isDelivered: { type: "boolean" },
                deliveredAt: { type: "string", format: "date-time" }
            }
        },

        // TRANSACTION
        // Inside src/docs/swagger.ts components.schemas
        Transaction: {
            type: "object",
            properties: {
                _id: { type: "string" },
                user: { type: "string", description: "User ID" },
                order: { type: "string", description: "Order ID" },
                reference: { type: "string", example: "65a123..." },
                amount: { type: "number" },
                currency: { type: "string", default: "NGN" },
                status: { type: "string", enum: ["pending", "success", "failed"] },
                email: { type: "string" },
                paidAt: { type: "string", format: "date-time" }
            }
        },


        //USER 
        User: {
            type: "object",
            properties: {
                _id: { type: "string", example: "65a123..." },
                username: { type: "string", example: "johndoe" },
                email: { type: "string", format: "email", example: "john@example.com" },
                isAdmin: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
            }
        },


        // UPLOAD FILE
        UploadedFile: {
            type: "object",
            properties: {
                url: { type: "string", example: "https://res.cloudinary.com/..." },
                public_id: { type: "string", example: "product-listing/image_123" },
                originalFilename: { type: "string", example: "product_photo.jpg" }
            }
        }

      },
    },
  },
  apis: ["./src/docs/*.yaml"],
};

export const specs = swaggerJSDoc(options);