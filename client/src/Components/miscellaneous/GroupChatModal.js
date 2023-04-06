import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,Button,useDisclosure, useToast, FormControl, Input, Box} from '@chakra-ui/react'
import { useState } from 'react'
import axios from "axios"
import { ChatState } from '../../Context/ChatProvider'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from "../UserAvatar/UserBadgeItem"

const GroupChatModal=({children})=>{

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState("")
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)

    const toast=useToast()

    const {user,chats,setChats}=ChatState()

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`api/users?search=${search}`,config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title:"Error Occured",
                description:"Failed to load Search Results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            })
            
        }
    }
    const handleSubmit=async()=>{
        if(!groupChatName ||!selectedUsers){
            toast({
                title:"Please Fill All The Fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.post("api/chat/group",{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map(u=>u._id))
                },
                config
            )
            setChats([data,...chats])
            onClose();

            toast({
                title:"New Group Chat Created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })

        } catch (error) {
            toast({
                title:"Failed to Created the Group",
                description:error.response.data,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        }
    }
    const handleDelete=(delUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel._id !==delUser._id))
    }
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User already added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    return (
        <div>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize='35px'
                fontFamily="work  sans"
                display="flex"
                justifyContent='center'
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display='flex'
                flexDir='column'
                alignItems="center"
              >
                <FormControl>
                    <Input 
                        placeholder='Chat Name'
                        mb={3}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add Users eg: John, Col, Guest'
                        mb={1}
                        onChange={(e)=>handleSearch(e.target.value)}
                    />
                </FormControl>
                <Box
                    w="100%"
                    display="flex"
                    flexWrap="wrap"
                >
                    {selectedUsers.map(u=>(
                        <UserBadgeItem 
                            key={u._id}
                            user={u}
                            handleFunction={()=>handleDelete(u)}
                        />
                    ))}
                </Box>
                {loading?
                    <div>loading...</div>
                :
                    searchResult?.slice(0,4).map(users=>(
                        <UserListItem 
                            key={users._id}
                            user={users}
                            handleFunction={()=>handleGroup(users)}
                        />
                    ))  
                }
                
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
                
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )
}
export default GroupChatModal;