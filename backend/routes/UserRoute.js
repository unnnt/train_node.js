import express from "express";
import {
     getUsersSearch,
     getUserById,
     createUser,
     updateUser,
     deleteUser,
     getUsersSorted
 } from "../controller/UserController.js";

const router = express.Router();

router.get('/users/sorted', getUsersSorted);
router.get('/users', getUsersSearch);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);



export default router;