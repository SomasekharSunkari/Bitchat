import { Button, FormControl, Box, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import axios from "axios"

import { useToast } from "@chakra-ui/react"
import { data, useNavigate } from "react-router-dom"
import React, { useState } from 'react'
const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setloading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const handelClick = (e) => {
        setShow((prev) => !prev)
    }
    const submitHandler = async () => {
        setloading(true);

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };

            const { data } = await axios.post("/api/user/login", { email, password }, config);

            toast({
                title: "Login Successful!",
                duration: 5000,
                status: "success",
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/chats");
        } catch (err) {
            toast({
                title: "Invalid password or Email",
                description: data,
                duration: 5000,
                status: "error",
                isClosable: true,
                position: "bottom"
            });
        } finally {
            setloading(false);
        }
    };

    return (
        <VStack spacing={"1.5"} color={"black"} bg={"transparent"}>
            <FormControl id='email' isRequired>
                <FormLabel >
                    Email
                </FormLabel>
                <Input placeholder='Enter the email ' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel >
                    password
                </FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'} value={password} placeholder='Enter password ' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5em"} >
                        <Button onClick={handelClick}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme='blue' w={"100%"} m={"1rem 0 5px 0"} color={"white"} isLoading={loading} onClick={submitHandler}>Login</Button>
            <Button bg={"red.300"} color={"white"} onClick={() => {
                setEmail("guestuser@gmail.com")
                setPassword("guestuser")
            }} w={"100%"} >Login with Guest Credentials </Button>
        </VStack>
    )
}

export default Login
