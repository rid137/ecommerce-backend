import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';
import userController from '../controllers/user.controller';

const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizeAdmin, userController.getAllUsers);

router
  .route("/profile")
  .get(authenticate, userController.getCurrentUserProfile)
  .put(authenticate, userController.updateCurrentUserProfile);
  
router.get("/admin", authenticate, authorizeAdmin, userController.getAllAdminUsers)
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, userController.deleteUserById)
  .get(authenticate, authorizeAdmin, userController.getUserById)
  .put(authenticate, authorizeAdmin, userController.updateUserById);


export default router;