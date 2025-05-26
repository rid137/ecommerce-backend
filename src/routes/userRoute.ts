import express from 'express';
import { deleteUserById, getAllAdminUsers, getAllUsers, getCurrentUserProfile, getUserById, updateCurrentUserProfile, updateUserById } from '../controllers/userController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizeAdmin, getAllUsers);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);
  
  // ADMIN ROUTES 👇
router.get("/admin", authenticate, authorizeAdmin, getAllAdminUsers)
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);


export default router;