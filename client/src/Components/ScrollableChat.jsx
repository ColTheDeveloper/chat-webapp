import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed"
import { ChatState } from "../Context/ChatProvider";
const ScrollableChat=({messages})=>{
    const {user}=ChatState()
    return(
        <ScrollableFeed>
        {messages && messages.map((m,i)=>{
            
            return(
            <div  style={{display:"flex",
                        justifyContent:`${m.sender._id ===user._id ? "flex-start" : "flex-start"}`,
                        flexDirection:`${m.sender._id ===user._id ? "row-reverse" : "row"}`,
                        marginBottom:"1rem"}} key={m._id}>
                {
                    <Tooltip
                        label={m.sender.name}
                        placement="bottom-start"
                        hasArrow
                    >
                        <Avatar
                            mt="7px"
                            mr={1}
                            size="sm"
                            cursor="pointer"
                            name={m.sender.name}
                            src={m.sender.pic} 
                        />
                        
                    </Tooltip>}
                    <span style={{backgroundColor: `${m.sender._id ===user._id ? "#bee3f8" : "#b9f5d0"}`,
                        borderRadius:"20px",
                        padding:"5px 15px",
                        maxWidth:"75%",
                        
                    }}
                        
                    >
                        {m.content}
                    </span>
            </div>)
        })}
        </ScrollableFeed>
    )
}
export default ScrollableChat;