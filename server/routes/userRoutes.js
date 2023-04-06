
const express=require("express")
const { allUsers, loginUser, registerUser }= require("../controllers/userControllers.js")
const { protect }=require("../middleware/authMiddleware.js")

const router= express.Router()

router.post("/login", loginUser)
router.post("/register", registerUser)
router.get("/users",protect, allUsers)

module.exports=router