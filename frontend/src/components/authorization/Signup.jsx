import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import axios from "axios";
import { useState } from 'react';
import { useToast } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [show, setShow] = useState(false);
    const [confirmShw, setConfirmShow] = useState(false);
    const [loading, setloading] = useState(false);
    const [pic, setPic] = useState("");
    const navigate = useNavigate();
    const toast = useToast();
    const handelClick = (e) => {
        setShow((prev) => !prev)
    }
    const handelClickConfirm = (e) => {
        setConfirmShow((prev) => !prev)
    }
    const submitHandler = async () => {
        setloading(true);
        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match!",
                duration: 5000,
                status: "warning",
                isClosable: true,
                position: "bottom"
            });
            setloading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };

            const { data } = await axios.post("http://localhost:5000/api/user", { name, email, password, pic }, config);
            console.log(data)

            toast({
                title: "Registration Successful!",
                duration: 5000,
                status: "success",
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/chats");
        } catch (err) {
            toast({
                title: "Error Occurred!",
                description: "Sekhar",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: "bottom"
            });
        } finally {
            setloading(false);
        }
    };

    const processImage = async (pic) => {
        setloading(true);
        if (pic === undefined) {
            toast({
                title: "Please Choose a Image",
                duration: 2000,
                status: "warning",
                isClosable: true,
                position: "bottom"

            });
            return;
        }
        if (pic.type === "image/png" || pic.type === "image/jpeg") {
            const formData = new FormData();
            formData.append("file", pic);
            formData.append("upload_preset", "chat-app")
            formData.append("cloud_name", "dxrvhlhgg")
            fetch("https://api.cloudinary.com/v1_1/dxrvhlhgg/image/upload",
                {
                    method: "post",
                    body: formData
                }
            ).then((res) => res.json()).then((data) => {
                console.log(data.url.toString())
                setPic(data.url.toString());
                console.log(data.url)
                console.log(pic)
                setloading(false)
                console.log("Uploaded")
            }).catch((err) => {
                console.log(err)
                setloading(false)
            })
        }
        else {
            toast({
                title: "Please Choose a Image",
                duration: 5000,
                status: "warning",
                isClosable: true,
                position: "bottom"

            });

            setloading(false);
            return;
        }



    }
    return (
        <VStack spacing={"2.5"}>
            <FormControl id='name' isRequired>
                <FormLabel >
                    Name
                </FormLabel>
                <Input placeholder='Enter your name ' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel >
                    Email
                </FormLabel>
                <Input placeholder='Enter the email ' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel >
                    password
                </FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'} placeholder='Enter password ' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5em"} >
                        <Button onClick={handelClick}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirmPassword' isRequired>
                <FormLabel >
                    Confirmpasswrd
                </FormLabel>
                <InputGroup>
                    <Input type={confirmShw ? "text" : 'password'} placeholder='Enter password ' onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width={"4.5em"} >
                        <Button onClick={handelClickConfirm}>{confirmShw ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='file' isRequired>
                <FormLabel >
                    Upload Your Picture
                </FormLabel>
                <Input p={"1.5"} accept='image/*' type="file" onChange={(e) => processImage(e.target.files[0])} />
            </FormControl>

            <Button width={"100%"} mt={"5px"} bg={"red.300"} color={"white"} _hover={{ color: "white.200" }} isLoading={loading}
                onClick={submitHandler}
            >Singup</Button>
        </VStack>
    )
}

export default Signup
