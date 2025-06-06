import { extractTime } from "../../../../Backend/utils.js/extractTime";
import { useAuthContext } from "../../context/AuthContext";
import userConversation from "../../zustand/useConversation";


const Message = ({message}) => {

    const {authUser} =useAuthContext();
    console.log("authUser is in Message.jsx:",authUser)
    const {selectedConversation} = userConversation();

    const fromMe =message.senderId===authUser._id;

    const chatClassName = fromMe ? 'chat chat-end' : ' chat-start';

    const profilePic=fromMe ? authUser.profilePic : selectedConversation?.profilePic;

    const bubbleBgColor = fromMe ? 'bg-blue-500' : '';
    const formattedTime=extractTime(message.createdAt);
    const shakeClass =message.shouldShake ? "shake" : "";
    return (
    <div className={`chat ${chatClassName}`}>
    <div className='chat-image avatar'>
    <div className='w-10 rounded-full'>
    <img
    alt='Tailwind CSS chat bubble component'
    src={
    profilePic 
    }
    />
    </div>
    </div>
    <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}  pb-2`}>{message.message}</div>
    <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
    </div>
    );
    };
    export default Message;