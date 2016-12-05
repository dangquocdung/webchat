var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000, function(){
  console.log("server ready");
});

var mangUsersOnline = [];

io.on("connection", function(socket){
  console.log("Co nguoi vua ket noi, socket id: " + socket.id);
  socket.on("client_gui_username", function(data){
    console.log("Co nguoi vua dang ki username la: " + data);
    if (mangUsersOnline.indexOf(data) >= 0){
      socket.emit("server-send-dangki-thatbai", data);
    }else{
      mangUsersOnline.push(data);
      socket.username = data;
      io.sockets.emit("server-send-dangki-thanh-cong", {username: data, id: socket.id});
    }
  });

  socket.on("client_gui_message",function(data){
    io.sockets.emit("server-gui-message",{username: socket.username, msg: data});
  });

  socket.on("user_chocgheo_socketid_khac", function(data){
    io.to(data).emit("server-xuly-chocgheo", socket.username);
  })
});

app.get("/",function(req, res){
  res.render("trangchu");
});
