
var io =require("socket.io").listen(9999);
var connectionList=[];//多个socket
var usernameList=[];

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//删除用户名
function deleteUserNameList(arr,socketid) {

    arr.forEach(function (item,index) {
        if(item.id == socketid){
            arr.remove(item);
        }
    })

}
io.sockets.on("connection",function(socket){
    connectionList[socket.id]={socket:socket};
    socket.on("regchat",function(data){
        connectionList[socket.id].username=data.username;
        connectionList[socket.id].sex=data.sex;
        socket.username=data.username;
        socket.sex=data.sex;
        usernameList.push({id:socket.id,name:data.username,sex:data.sex});
        io.sockets.emit("userconnected",{"userlist":usernameList,sender:"系统",msg:"欢迎"+data.username+"加入聊天室！"})
    });
    socket.on ("disconnect",function () {
        var username = connectionList[socket.id].username;
        connectionList.remove(connectionList[socket.id]);
        deleteUserNameList(usernameList,socket.id);
        io.sockets.emit("userconnected",{"userlist":usernameList,sender:"系统",msg:"欢送"+username+"离开聊天室！"})
    });
    socket.on("servermsg",function (data) {
        if (data.msgtpye == '0')//接受服务器发给所有人的信息（群聊）
        {
            io.sockets.emit("clientmsg", data);
        }
        else//私聊
        {
            var rsocketid=data.receiver.socketid;
            connectionList[rsocketid].socket.emit("clientmsg",data);//给收件人发一份
            socket.emit("clientmsg",data);//给发件人自己也得发一份

        }
    });

});
console.log("服务器开始监听端口：9999");