import React , {useState} from 'react'
import axios from 'axios'
import { FormControl, FormLabel, InputGroup, InputRightElement, VStack,Button, Toast } from '@chakra-ui/react'
import {Input} from '@chakra-ui/react'
import {useToast} from '@chakra-ui/react'
import { useHistory } from "react-router-dom"

const Login = () => {
  const [show,setShow] = useState(false)
  const [name,setName] = useState()
  const [email,setEmail] = useState()
  const [confirmpassword,setconfirmPassword] = useState()
  const [password,setPassword] = useState();
  const [pic,setPic] = useState()  
  const [loading,setLoading] = useState();
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);
  
  const submitHandler = async() => {
     
     setLoading(true)
     if(!email || !password){
        toast({
           title:"Please fill all the fields",
           status:"warning",
           duration:5000,
           isClosable:true,
           position:"bottom"
        })
        setLoading(false)
        return
     }
     
    //  console.log(email,password)

     try {
       const config = {
         headers: {
            "Content-type": "application/json",
         },
       };

       const {data} = await axios.post(
         "/api/user/login",
         {email,password},
         config
       );

      //  console.log(JSON.stringify(data))
       toast({
        title:"Login Successful",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom",
       })
       localStorage.setItem("userInfo",JSON.stringify(data))
       setLoading(false)
       history.push("/chats");
     } catch(err){
        toast({
           title:"Error occured",
           description:err.response.data.message,
           status:"error",
           duration:5000,
           isClosable:true,
           position:"bottom"
        })
        setLoading(false)
     }
  }
  return (
    <VStack spacing="5px">
         
         <FormControl>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your Email'
            onChange={(e)=>setEmail(e.target.value)}/>
         </FormControl>
         <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show? "text" : "password"} placeholder='Enter your Password'
                 onChange={(e)=>setPassword(e.target.value)}/>
                 <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                 </InputRightElement>
            </InputGroup>
         </FormControl>

        
         <Button
           colorScheme='blue'
           width="100%"
           style={{marginTop:15}}
           onClick={submitHandler}
           isLoading={loading}
         >
           Login
         </Button>
         <Button
           variant="solid"
           colorScheme='red'
           width="100%"
           onClick={() => {
             setEmail("guest@example.com")
             setPassword("123456")
           }}
         >
           Get Login Crudentials
         </Button>
    </VStack>
  )
}

export default Login
