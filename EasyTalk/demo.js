/**
 * Created by admin on 2017/4/28.
 */
var io=require("socket.io").listen(8888);
io.sockets.on("connection",function(socket){
    console.log("有客户端加入");
    socket.on("login",function(data){
        console.log(data.username);
    });

    socket.emit("clientmsg",{username:"水晶之恋",sex:"女"});
    //io.sockets.emit表示给当前有连接的所有的客户端发送信息
    //io.sockets.emit("clientmsg",{username:"水晶之恋",sex:"女"});
});
console.log("服务器开始监听端口:8888");