
import { useEffect, useState } from "react"
import { ChatState } from "../Context/ChatProvider"
import SideDrawer from "../Components/miscellaneous/SideDrawer"
import MyChats from "../Components/MyChats"
import ChatBox from "../Components/ChatBox"
import { Box } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
const Chatpage=()=>{
    const navigate=useNavigate()
    
    //const [newNser,setNewUser]=useState({})
    const [fetchAgain, setFetchAgain]=useState(false)

    
    useEffect(()=>{
        const userInfo= JSON.parse(localStorage.getItem("userInfo"))
        if(!userInfo){
            navigate("/")
        }
            
            //setUser(userInfo)
    },[navigate])

    const {user}= ChatState()

    
    return(
        <div style={{width:'100%'}}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="10px"
            >
                {user && ( 
                    <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> 
                )}
                {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
            </Box>
            
        </div>
    )
}
export default Chatpage;