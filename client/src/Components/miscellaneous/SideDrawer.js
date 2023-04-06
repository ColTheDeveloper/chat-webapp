import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useToast } from "@chakra-ui/react";
import {  Drawer,  DrawerBody, DrawerHeader,  DrawerOverlay,  DrawerContent} from '@chakra-ui/react'
import { Spinner}from "@chakra-ui/spinner"
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import {useState} from "react"
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import { useDisclosure} from "@chakra-ui/hooks"
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../config/ChatLogics";
import axios from "axios"
import ChatLoading from "../ChatLoading";
import "../Styles.css"
const SideDrawer=()=>{
    const [search, setSearch]=useState("")
    const [searchResult, setSearchResult]=useState([])
    const [loading, setLoading]=useState(false)
    const [loadingChat, setLoadingChat]=useState();
    const navigate=useNavigate()

    const {isOpen,onOpen, onClose}=useDisclosure()

    const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState()
    const toast=useToast()

    const logOutHandler=()=>{
        localStorage.removeItem("userInfo")
        localStorage.removeItem("notificationData")
        setNotification([])
        setSelectedChat()
        navigate("/")
    }
    const handleSearch= async()=>{
        if(!search){
            toast({
                title:"Please Enter Something in Search",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
            });
            return;
        }
            try {
                setLoading(true)

                const config={
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    },
                }
                const {data}= await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users?search=${search}`,config)
                setLoading(false)
                setSearchResult(data)

            } catch (error) {
                toast({
                    title:"Error Occured",
                    description:"Failed to load the search results",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom-left"
                })
                
            }
    }
    const accessChat=async(userId)=>{
        try {
            setLoadingChat(true)
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`,
                },

            };
            const {data}=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {userId},config);

            if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats])
            setSelectedChat(data)
            setLoadingChat(false)
            onClose();
        } catch (error) {
                toast({
                    title:"Error fetching chat",
                    description:error.message,
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom-left"
                })
        }


    }
    return(
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{base:"none",md:"flex"}} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2x1' fontFamily='work sans'>
                    Chat Webapp
                </Text>
                <div>
                    <Menu position="relative">
                        {notification.length !== 0 && <span className="notification">{notification.length}</span>}
                        <MenuButton p={1}>
                            <BellIcon fontSize="2x1" m={1}/>
                        </MenuButton>
                        <MenuList pl={2}
                        >
                            {!notification.length && "No New Messages"}
                            {notification.map((not)=>(
                                <MenuItem key={not._id} onClick={()=>{
                                    setSelectedChat(not.chat);
                                    setNotification(notification.filter((n)=>n!==not))
                                }}>
                                    {not.chat.isGroupChat?`New Message in ${not.chat.chatName}`:`New Message from ${getSender(user, not.chat.users)}`}

                                    <hr />
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic}/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>LogOut</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px" >Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input 
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e)=> setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading?<ChatLoading />:(
                            searchResult?.map(user=>(
                                <UserListItem   
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user._id)}
                                />    
                            ))
                            
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
                
            </Drawer>
        </div>
    )
}
export default SideDrawer;