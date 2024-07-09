import { Server } from "socket.io";

const io=new Server({
    cors:{
        origin:"http://localhost:5173"
    }
})

let onlineUsers=[]

const addUser=(UserId,socketId)=>{
    const userExits=onlineUsers.find(user=>user.UserId===UserId)
    if(!userExits){
        onlineUsers.push({UserId,socketId})
    }
}

const removeUser=(socketId)=>{
    onlineUsers=onlineUsers.filter((user)=>user.socketId!==socketId)
}

const getUser=(userId)=>{   //private message
    return onlineUsers.find((user)=>user.userId===userId)
}

io.on("connection",(socket)=>{
    // console.log(socket.id)
    socket.on("newUser",(userId)=>{
        addUser(userId,socket.id) //client , servere
        console.log(onlineUsers)
    })

    socket.on("sendMessage",(receiverId,data)=>{
        const receiver=getUser(receiverId)
        io.to(receiver.socketId).emit("getMessage",data)
        console.log(receiverId)
    })

    socket.on("disconnect",()=>{
       removeUser(socket.id)
    })
})
io.listen("4000")


//emit for send 