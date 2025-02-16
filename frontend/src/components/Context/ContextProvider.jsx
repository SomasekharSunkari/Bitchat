import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if (!userInfo) navigate("/");
    }, [navigate]);

    return (
        <ChatContext.Provider value={{
            selectedChat,
            setSelectedChat,
            user,
            setUser,
            notifications,
            setNotifications,
            chats,
            setChats,

        }}>
            {children}
        </ChatContext.Provider>
    );
};

// Hook to use ChatContext
export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
