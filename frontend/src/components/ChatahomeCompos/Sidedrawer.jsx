import {
    Button, Tooltip, Box, Text, Menu, MenuItem, MenuButton,
    MenuList, Avatar, MenuDivider, Input, Spinner
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa'; // Bell icon from react-icons
import { Badge } from '@chakra-ui/react'; // Badge from Chakra UI to display the count

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
import { getSender } from '../../configs/message_logics';

const Sidedrawer = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, selectedChat, setSelectedChat, chats, setChats, notifications,
        setNotifications } = ChatState();
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
            const { data } = await axios.get(`/api/user?search=${search}`, config);
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
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("/api/chat", { userId }, config);

            //If the Chat alredy present in the current chats ignore that one
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data)
            setLoadingChat(false);
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
                    <Button variant="ghost" display={"flex"} alignItems={"center"} gap={"20px"} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "block" }} fontSize="12px">Search Users</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="3xl" fontFamily="Work sans" fontWeight={"bold"}>Bitchat</Text>

                <div className='flex'>
                    <Menu>
                        <MenuButton p={1} position="relative">
                            <Box position="relative" display="inline-block">
                                {notifications.length > 0 && (
                                    <Badge
                                        colorScheme="red"
                                        variant="solid"
                                        borderRadius="full"
                                        fontSize="0.7em"
                                        position="absolute"

                                        right="6px"

                                    >
                                        {notifications.length} {/* Displaying notification count */}
                                    </Badge>
                                )}
                                <FaBell className="text-2xl mt-3 mr-3" />
                            </Box>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notifications.length && "No New Messages"}
                            {notifications.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotifications(notifications.filter((n) => n !== notif));

                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
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
