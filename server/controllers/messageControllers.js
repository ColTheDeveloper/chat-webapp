const asyncHandler =require("express-async-handler");
const chatModel =require("../models/chatModel.js");
const messageModel =require("../models/messageModel.js");
const userModel =require("../models/userModel.js");

const sendMessage=asyncHandler(async(req,res)=>{
    const {content, chatId}=req.body

    if(!content || ! chatId){
        return res.sendStatus(400).json("Invalid data passed into request")
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try {
        var message=await messageModel.create(newMessage)

        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message= await userModel.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })

        await chatModel.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        })
        
        res.json(message)


    } catch (error) {
        res.status(400)
        throw new Error(error.message)

    }
})

const allMessages=asyncHandler(async(req,res)=>{
    try {
        const messages=await messageModel.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
        res.json(messages)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
        
    }
})

module.exports={sendMessage,allMessages}