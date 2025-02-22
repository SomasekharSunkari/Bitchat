import React, { useState } from 'react'
import { Box } from '@chakra-ui/react';
import { ChatState } from './Context/ContextProvider'
import Sidedrawer from './ChatahomeCompos/Sidedrawer';
import MyChats from './ChatahomeCompos/MyChats';
import ChatSpace from './ChatahomeCompos/ChatSpace';

const Chatpage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%" }}>
            {
                user && <Sidedrawer />
            }
            <Box display="flex" overflowY={"hidden"} justifyContent={"space-between"} h={"95vh"} w={"100%"} p={"30px"}>

                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatSpace fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

            </Box>

        </div>
    )
}

export default Chatpage
