import React, { useEffect, useMemo, useState } from 'react'
import {FaMessage,FaClockRotateLeft, FaUser,FaGear,FaTelegram} from 'react-icons/fa6'
import messgeicon from '../images/messgeimg.webp'
import { useSelector } from 'react-redux'
// import gql from
// import { CREATE_CHAT } from './mutations'
import { useSubscription, useMutation,useQuery,gql} from '@apollo/client'
import { useAccessToken, useUserData } from '@nhost/react'


const MY_CHATS = gql`query MyChats {
chat_participants{
chat_id
chat { id title created_at}
}
}`;

const CREATE_CHAT = gql`
mutation CreateChat($title:String,$user_id:uuid){
  insert_chats_one(object:{title:$title,user_id:$user_id}) {
  id
  title
  }
}
`;


const ADD_SELF_TO_CHAT = gql`
 mutation AddSelfToChat($chatId:uuid)
{
  insert_chats_participants_one(object:{chat_id:$chatId}){
   chat_id
  } 
}
 `

const SUBSCRIBE_MESSAGES = gql`subscription GetMessages($chat_id: uuid) {
  messages(where: {chat_id: {_eq: $chat_id}}, order_by: {created_at: asc})
  {
    sender
    content
  }
}`;

const SEND_MESSAGE = gql`
mutation SendMessage($chat_id: uuid, $content: String, $sender: String) {
  insert_messages(objects: {chat_id: $chat_id, content: $content, sender: $sender}) {
    affected_rows
  }
}

`;
function Chattingpage() {
    const token = useAccessToken();

    const user = useUserData();
    const [activeChatId, setActiveChatId] = useState(null);
    const [text, setText] = useState('');

    const [newChatTitle, setNewChatTitle] = useState('');
    const [chatcreationstatus, setChatcreationstatus] = useState('Chatactive')
    const [fetchedmessage, setFetchedmessage] = useState([
        {
            "sender": "bot",
            "content":"How can i assist"
        },
        {
            "sender": "user",
            "content":`Hello I am ${user.displayName}`
        },
        {
            "sender": "bot",
            "content":`Hello ${user.displayName},Welcome to the chatbot`
        },

    ]);

    const { data:chatsData, refetch:refetchChats} = useQuery(MY_CHATS);
    const [createChat] = useMutation(CREATE_CHAT);
    const [addSelf] = useMutation(ADD_SELF_TO_CHAT);
    const [sendMessage] = useMutation(SEND_MESSAGE);

    // const { data: messagesData } = useSubscription(SUBSCRIBE_MESSAGES, {
    //     variables: { chatId: activeChatId },
    //     skip:!activeChatId
    // })

    
    const fetchdata = useSubscription(SUBSCRIBE_MESSAGES, {
        
        variables: { chat_id: activeChatId },
        skip:!activeChatId
    })
    // const fetchdata = useSubscription(SUBSCRIBE_MESSAGES, {
        
    //     variables: { chat_id: "55444e51-ecc7-47a5-9f71-c12cd48eebc4"},
    //     skip:""
    // })
    // const chats = useMemo(() => chatsData?.chat_participants?.map(cp => cp.chat) ?? [],[chatsData]);

    const handleCreateChat = async (e) => {

        e.preventDefault();
        if (!newChatTitle.trim()) {
            return;
        }
        try {
            
            const res = await createChat({variables:{title:newChatTitle,user_id:user.id}});
            const chatId = res?.data?.insert_chats_one.id;

            // await addSelf({ variables: { chatId } });
            const botresponse = await fetch('https://nivashn8n6789.app.n8n.cloud/webhook/chatbotwebsite', {
                method: "POST",
                headers: {
                    "Content-type":"application/json"
                }
            })
            
            alert('Chat Created')
            if (botresponse.status == 200)
            {

                const boddata = await botresponse.json();
                const botreply = boddata.reply;
                await sendMessage({ variables: { chat_id: chatId, content: botreply, sender: 'bot' } })
            }
            
            
            
            setNewChatTitle('');
            // await refetchChats();
            setActiveChatId(chatId)
            setChatcreationstatus('Chatinactive');
        }
        catch (e) {
            alert('Error'+e.message)
        }
    };

    const handlesend = async () => {
        // e.preventDefault();
        if (!text.trim() || !activeChatId) {
            return;
        }
        await sendMessage({
            variables: {
                chat_id: activeChatId, content: text, sender:'user'
         } });
        setText('');
        // console.log(fetchdata)
        
        const chatbotbody = {
            message:text
        }
         const chatbotres = await fetch('https://nivashn8n6789.app.n8n.cloud/webhook/chatbotwebsite', {
             method: "POST",
             headers: {
                 'Content-type':"application/json"
                },
                body:JSON.stringify(chatbotbody)
            })
            const chatbotreply = await chatbotres.json();
            
        
        await sendMessage({
            variables: {
                chat_id: activeChatId, content:chatbotreply.reply, sender:'bot'
            }
        });
        
        console.log(fetchedmessage.messages)
        setFetchedmessage(fetchdata.data.messages);
        
       
    }



    const {username}=useSelector((state)=>state.datastore)
    return (
        <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>

        

      <div id="chatlayout">
          <div>
              <div style={{display:"flex",justifyContent:"center",height:"200px",alignItems:"center"}}>
                  <div style={{width:"50px",height:"50px"}}><img src={messgeicon} style={{width:"100%",height:"100%"}}></img></div>
              </div>
              <div className='sidemenu'>
                  <div style={{marginLeft:"-50px"}}><FaMessage/></div>
                  <div>Chat</div>
              </div>
              <div className='sidemenu'>
                  <div style={{marginLeft:"-35px"}}><FaClockRotateLeft/></div>
                  <div>History</div>
              </div>
              <div className='sidemenu'>
                  <div style={{marginLeft:"-37px"}}><FaUser/></div>
                  <div>Profile</div>
              </div>
              <div className='sidemenu'>
                  <div style={{marginLeft:"-28px"}}><FaGear/></div>
                  <div>Settings</div>
              </div>
        
          </div>
          <div style={{ backgroundColor: "white" }} id="chattingcontainer">
              <div id="navheader">
                  <div id="chatlogo">Chat</div>
                  <div id="useraccount">Welcome!,{username }</div>   
                  
              </div>
                    <div id="Messageplate">
                        {
                            fetchedmessage.map((val, i) =>
                                <div style={{display:"flex",justifyContent:val.sender=="bot" ? "start":"end"}}>
                                    <div style={{width:"200px",height:"50px",backgroundColor:"lightblue",borderRadius:"8px"}}>{val.content }</div>
                                  </div>
                            )
                        }
                  
              </div>
                    <div id="Inputmessage">
                        

                  <div >
                      
                      <input type="text" placeholder='Type a message..' onChange={(e)=>{setText(e.target.value)}} value={text} />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }} onClick={() => {
                                
                                if (text !== "")
                                {

                                    handlesend();
                                }
                      }} ><FaTelegram size={26} /></div>
                  </div>
                
              </div>
          </div>

            </div>
            <div className={chatcreationstatus}>

           <form onSubmit={handleCreateChat} >
                    <div id="chatcreationbackground" >
                        <div style={{display:"flex",justifyContent:"center",marginTop:"150px"}}>

                            <div id="chatcreationbox" >
                                <div id="xclose" onClick={() => { setChatcreationstatus('Chatinactive') }}>X</div>
                                <div style={{textAlign:"center",fontWeight:"bold"}}>Create a Topic</div>
                <div>
                    <label>Topic</label>
                </div>
                <div>
                    <input type="text" placeholder='Enter the Topic' required value={newChatTitle} onChange={(e)=>{setNewChatTitle(e.target.value)}} />
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <button type="submit" onClick={()=>{console.log(token)}} >Create</button>
                </div>
            </div>
        </div>
                        </div>
            </form>

        
            </div>
        </div>
  )
}

export default Chattingpage