import {
    Button, Tooltip, Box, Text, Menu, MenuItem, MenuButton,
    MenuList, Avatar, MenuDivider, Input, Spinner
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../Context/ContextProvider';
import ProfileModel from '../ProfileModel';
import {
    Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay
} from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import UserListItme from '../UserListItme';

const Sidedrawer = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();

    // Logout function
    const logOutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    // Handle search request
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setSearchResult(data);
        } catch (error) {
            console.error("Search Error:", error);
            toast({
                title: "Error Occurred!",
                description: "Failed to load search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to access chat
    const accessChat = async (userId) => {
        console.log(`Accessing chat with user: ${userId}`);
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);
            console.log(data)
            console.log(chats)
            //If the Chat alredy present in the current chats ignore that one
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data)
            setLoadingChat(false);
            console.log(chats)

            onClose();
        }
        catch (err) {
            toast({
                title: "Error fetching the chat",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    return (
        <>
            <Box
                display="flex" justifyContent="space-between" alignItems="center"
                bg="white" w="100%" p="5px 10px" borderWidth="1px"
            >
                <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "block" }} fontSize="12px">Search Users</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">Chit Chat</Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            {/* Drawer for searching users */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItme
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidedrawer;
