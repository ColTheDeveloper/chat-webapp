
const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")


const userRoutes= require( "./routes/userRoutes.js")
const chatRoutes = require("./routes/chatRoutes.js")
const messageRoutes=require( "./routes/messageRoutes.js")
const { notFound, errorHandler }=require("./middleware/errorMiddleware.js")

const app=express()
dotenv.config()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const PORT=process.env.PORT
const CONNECTION=process.env.CONNECTION

mongoose
    .connect(CONNECTION)
    .then(console.log("connected to mongoose"))
    .catch(error=>console.log(error))
;

const server=app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
});

const io=require("socket.io")(server,{
    cors:{
        pingTimeout:60000,
        origin:process.env.FRONTEND_URL
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket io")

    socket.on("setup", (userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })
    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room "+room)
    })
    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageReceived)=>{
        var chat= newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user=>{
            if(user._id ==newMessageReceived.sender._id) return

            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })
})



app.get("/api", (req,res)=>{
    res.send(`API is running on port ${PORT}`)
})    

app.use("/api", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message",messageRoutes)
app.use(notFound)
app.use(errorHandler)