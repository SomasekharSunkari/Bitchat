import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ContextProvider'
import { Box, Fade, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender, getSenderFull } from "../../configs/message_logics.js"
import Lottie from "react-lottie";
import ProfileModel from '../ProfileModel.jsx';
import UpdatedchatModel from './UpdatedchatModel.jsx';
import ScrollabelMessages from './ScrollabelMessages.jsx';
import animationdata from "../animations/typing.json"
import axios from "axios";
const ENDPOINT = "http://localhost:5000";
import io from "socket.io-client"
var socket, selectedChatCompare;
const SingleChat = ({ setFetchAgain, fetchAgain }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationdata,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const { user, selectedChat, setSelectedChat, setNotifications, notifications } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `http://localhost:5000/api/messages/${selectedChat._id}`,
                config
            );

            console.log(data)
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id)
            // socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            //   socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:5000/api/messages",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }

    };
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {

            let timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false);
            }

        }, (timerLength));

    }
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;//This is to determine selected chat 
    }, [selectedChat]);

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))

        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])
    useEffect(() => {
        socket.on("Message recieved", (newMessage) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
                if (!notifications.includes(newMessage)) {
                    setNotifications([...notifications, newMessage]);
                }
            }
            else {
                setMessages([...messages, newMessage])
            }
        })
        console.log(notifications)

    })
    return (
        <>
            {
                selectedChat ? <>
                    <Box
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {
                            selectedChat.isGroupChat ? (<>{
                                selectedChat.chatName.toUpperCase()

                            }
                                <UpdatedchatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />


                            </>) : (<>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>)
                        }
                    </Box>
                    <Box display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden">
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollabelMessages messages={messages} />
                                {/* <ScrollableChat messages={messages} /> */}
                            </div>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            onChange={typingHandler}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />

                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>

                    </Box>

                </> :
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
            }

        </>
    )
}

export default SingleChat
