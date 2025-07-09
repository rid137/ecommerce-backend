// src/types/express/index.d.ts
import { UserDocument } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

// export {};
// src/types/express/index.d.ts
// import { UserDocument } from "../../models/user.model";

// // Essential declaration merging
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: UserDocument;
//   }
// }