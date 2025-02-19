import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/icons";
const Userpill = ({ user, handleFunction, admin }) => {

    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"

        >
            {user.name}
            {admin === user._id && <span> (Admin)</span>}
            <CloseIcon pl={1} onClick={handleFunction} />
        </Badge>
    );
}

export default Userpill
