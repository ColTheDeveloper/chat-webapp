import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,useToast } from "@chakra-ui/react";
import { useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { ChatState } from "../../Context/ChatProvider";

const Login=()=>{
    const [show,setShow]=useState()
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [loading,setLoading]=useState()
    const toast=useToast()
    const navigate=useNavigate()
    const {setUser}=ChatState()

    const handleClick=()=>setShow(!show)
    const submitHandler=async()=>{
        setLoading(true)
        if(!email ||!password){
            toast({
                title:"Please Fill All The Field",
                status:"warning",
                duration:"5000",
                isClosable:true,
                position:"buttom"
            })
            setLoading(false)
            return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                }
            }
            const {data}=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`,{email,password},config)
            setUser(data)
            toast({
                title:"Login Successful",
                status:"success",
                duration:"5000",
                isClosable:true,
                position:"buttom"
            })
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLoading(false)
            navigate("/chats")
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom"
            })
            setLoading(false)
        }

    }
    return(
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input 
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show?"text":"password"}
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show? 'Hide':'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>                
            </FormControl>
            <Button 
                colorScheme='blue'
                width='100%'
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
            >Log in</Button>
            <Button
                variant='solid'
                colorScheme='red'
                width='100%'
                isLoading={loading}
                onClick={()=>{
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >
            Get Guest User Credentials
            </Button>
        </VStack>
    )
}
export default Login;