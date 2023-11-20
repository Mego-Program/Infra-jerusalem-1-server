import express from "express";
import { getRowsfromAllUsers } from "../db/functionToDB.js";

const router = express.Router();


router.get('/userprfile', async (req, res) => {
       const response = await getRowsfromAllUsers("email, userName, profile")
       res.json(response)
})

export default router