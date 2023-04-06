import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from "@chakra-ui/react";
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { ChatState } from "../../Context/ChatProvider";

const SignUp=()=>{
    const [show,setShow]=useState(false)
    const [name, setName]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [pic,setPic]=useState("")
    const [loading,setLoading]=useState(false)
    const toast=useToast()
    const navigate=useNavigate()
    const {setUser}=ChatState()

    const handleClick=()=>{
        setShow(!show)
    }
    const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined){
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom"
            })
            return;
            
        }

        if(pics.type==="image/jpeg"|| "image/png"){
            const data= new FormData()
            data.append("file",pics)
            data.append("upload_preset","chat-webapp")
            data.append("cloud_name","djlvd6m7k")
            fetch("https://api.cloudinary.com/v1_1/djlvd6m7k/image/upload",{
                method:"post",
                body:data,
            }).then((res)=>res.json())
                .then((data)=>{
                    setPic(data.url.toString());
                    setLoading(false);
                    
                })
                .catch((err)=>{
                    console.log(err);
                    setLoading(false);
                })
            
            
        }else{
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom"
            })
            return;
            
        }

    }
    const submitHandler= async()=>{
        setLoading(true);
        if(!name ||!email ||!password ||!confirmPassword){
            toast({
                title:"Please Fill All The Field!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom"
            });
            setLoading(false);
            return;
        }
        if(password!==confirmPassword){
            toast({
                title:"Password DO Not Match!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom"
            })
            return;
        }
        try{
            const config={
                headers:{
                    "Content-type":"application/json"
                }
            }
            
            const {data}=await axios.post("/api/register", {name,email,password,pic},config);
            setUser(data)
            toast({
                title:"Registration Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLoading(false)
            navigate("/chats")
        }catch(error){
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
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input 
                    placeholder="Enter Your Name"
                    onChange={(e)=>setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    placeholder="Enter Your Email"
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show?"text":"password"}
                        placeholder="Enter Your Password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show? 'Hide':'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>                
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show?"text":"password"}
                        placeholder="Enter Your Password"
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show? 'Hide':'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>                
            </FormControl>
            <FormControl>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input 
                    type='file'
                    p={1.5}
                    accept="image/*"
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button 
                colorScheme='blue'
                width='100%'
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
            >Sign Up</Button>
        </VStack>
    )
}
export default SignUp;