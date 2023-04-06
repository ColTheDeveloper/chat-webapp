import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { getSender,getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios"
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./miscellaneous/ProfileModal";
import { Player } from '@lottiefiles/react-lottie-player';
import typingIndicator from "../Animation/typing-ind.json"
import { useEffect, useState } from "react";
import "./Styles.css"
import {io} from "socket.io-client"

const ENDPOINT=process.env.REACT_APP_BACKEND_URL;
var socket,selectedChatCompare;

const SingleChat=({fetchAgain,setFetchAgain})=>{
    const {user,selectedChat,setSelectedChat,notification, setNotification}=ChatState()
    const [messages,setMessages]=useState([])
    const [loading,setLoading]=useState(false)
    const [newMessage,setNewMessage]=useState("")
    const [socketConnected,setSocketConnected]=useState(false)
    const [typing, setTyping]=useState(false)
    const [isTyping, setIsTyping]=useState(false)

    const toast=useToast()

    useEffect(()=>{
        socket=io(ENDPOINT)

        socket.emit("setup",user)
        socket.on("connected",()=>setSocketConnected(true))
        socket.on("typing",()=>setIsTyping(true))
        socket.on("stop typing",()=>setIsTyping(false))
    },[user])

    const fetchMessages=async()=>{
        if(!selectedChat) return

        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            setLoading(true)
            const {data}=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedChat._id}`,config)
            setMessages(data)
            setLoading(false)
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:"Failed to load all message",
                status:"error",
                duration:"5000",
                isClosable:true,
                position:"bottom"
            })
        }
    }
    useEffect(()=>{
        fetchMessages()
        selectedChatCompare=selectedChat
        
    },[selectedChat])

    useEffect(()=>{
        socket.on("message received", (newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id !==newMessageReceived.chat._id){
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain);
                }
                
            }else{
                setMessages([...messages, newMessageReceived])
            }
            
        })
    })
    

    const sendMessage= async(e)=>{
        if(e.key==="Enter" && newMessage){
            socket.emit("stop typing" ,selectedChat._id)
            try{
                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const {data}=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/message`,{
                    content:newMessage,
                    chatId:selectedChat._id
                },config)
                
                setNewMessage("")
                socket.emit("new message",data)
                setMessages([...messages,data]);
            }catch(error){
                toast({
                    title:"Error Occured!",
                    description:"Failed to send a message",
                    status:"error",
                    duration:"5000",
                    isClosable:true,
                    position:"bottom"
                })

            }
        }
    }
    localStorage.setItem("notificationData", JSON.stringify(notification))
    const typingHandler=(e)=>{
        setNewMessage(e.target.value)

        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit("typing",selectedChat._id)
        }
        let lastTypingTime= new Date().getTime()
        var timeLength=3000
        setTimeout(()=>{
            var timeNow=new Date().getTime()
            var timeDiff= timeNow - lastTypingTime

            if(timeDiff>= timeLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        },timeLength)
    }
    return(
        <>
            {selectedChat?
                <>
                    <Text
                        fontSize={{base:"20px",md:"23px"}}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="work sans"
                        display="flex"
                        justifyContent={{base:"space-between"}}
                        alignItems="center"
                    >
                        <IconButton
                            display={{base:'flex',md:'none'}}
                            icon={<ArrowBackIcon />}
                            onClick={()=>setSelectedChat("")}
                        />
                        
                        {!selectedChat.isGroupChat?
                            <>
                                {getSender(user,selectedChat.users)}
                                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                            </>
                        :
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal 
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        }
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#e8e8e8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading?
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto" 
                            /> 
                        :
                        <div className="messages">
                            <ScrollableChat messages={messages}/>
                        </div>}
                        
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping?
                            <div>
                                <Player
                                    autoplay
                                    loop
                                    src={typingIndicator}
                                    style={{width:"70px",marginLeft:0,display:"block",marginBottom:10}} 
                                >

                                </Player>
                            </div>:""}
                            <Input 
                                variant='filled'
                                bg="#e0e0e0"
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>

                </>
            :
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3x1" pb={3} fontFamily="work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            }
        </>
    )
}
export default SingleChat;