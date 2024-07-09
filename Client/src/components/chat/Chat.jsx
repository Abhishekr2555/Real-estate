import { useContext, useEffect, useState,useRef} from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/socketContext";
import { format } from "timeago.js";
function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext) || {};
  // const messageEndRef = useRef();

  console.log(socket);
  console.log(chats)

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await fetch(`http://localhost:8800/api/chat/${id}?receiverId=${receiver.id}`, {
        method: "GET",
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data || !data.id) {
        throw new Error(`Chat data or ID is undefined`);
      }

      console.log(data)
      setChat({ ...data, receiver });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    if (!chat || !chat.id) {
      console.error("Chat or chat.id is undefined");
      return;
    }


    try {
      const res = await fetch(`http://localhost:8800/api/message/${chat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chat]);

  useEffect(() => {

    const read = async () => {
      try {
        await fetch(`http://localhost:8800/api/chat/read/${chat.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
          credentials: "include",
        });

      } catch (error) {
        console.log(error)
      }
    }

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat(prev => ({ ...prev, message: [...prev, message, data] }))
          read()
        }
      })
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat])

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c?.id, c.receiver)}
          >
            <img src={c.receiver?.avtar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver?.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
              />
              {chat.receiver?.username ? chat.receiver.username : "Unknown"}
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span>
          </div>
          <div className="center">
            {chat.messages?.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message?.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            {/* <div ref={messageEndRef}></div> */}

          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
