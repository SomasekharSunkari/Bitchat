import { Container, Box, Text, Tabs, TableCaption, TabList, TabIndicator, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from "../components/authorization/Login.jsx"
import React, { useEffect } from 'react'
import Signup from "../components/authorization/Signup.jsx"
import { useNavigate } from "react-router-dom"
const Homepage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/chats")
    }, [navigate])
    return (
        <Container maxW="5xl" height={"1400px"} centerContent bgImage={""}>
            <Box display="flex" bg="transparent" w={"100%"} fontSize={"3xl"} justifyContent="center" fontFamily={"Poppins"} color={"white"} fontWeight={"bold"} m={"40px 0px 15px 0px"} p="20px" borderRadius="1lg" borderWidth={"1px"}>
                <Text textAlign={"center"} >
                    BitChat
                </Text>
            </Box>
            <Box w={"60%"} bg={"white"} borderWidth={"1px"} p={"10px"} borderRadius={"2xl"} >
                <Tabs variant={"soft-rounded"} colorScheme="red" >
                    <TabList borderRadius={"full"}>
                        <Tab width={"50%"} padding={"10px"}>Signup</Tab>
                        <Tab width={"50%"}>Login</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage
