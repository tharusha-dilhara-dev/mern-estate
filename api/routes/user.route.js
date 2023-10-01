import express from "express";
import { deleteUser, test, updateUser } from "../controllers/user.coontroller.js";
import { verifyToken } from "../utils/verifyToken.js";


const router=express.Router();

router.get("/test",test);
router.post("/update/:id",verifyToken,updateUser);
router.delete("/delete/:id",verifyToken,deleteUser);



export default router;