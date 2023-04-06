const express=require("express")
const { accessChat, fetchChats, createGroupChat,renameGroup, addToGroup, removeFromGroup } =require("../controllers/chatControllers.js");
const { protect } =require("../middleware/authMiddleware.js");

const router=express.Router()

router.post("/", protect, accessChat)
router.get("/", protect,fetchChats)
router.post("/group", protect,createGroupChat)
router.put("/group",protect,renameGroup)
router.put("/addGroupMember", protect, addToGroup)
router.put("/removeFromGroup", protect,removeFromGroup)



module.exports=router