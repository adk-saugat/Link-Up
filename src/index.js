const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const {
  generateMessage,
  generateLocationMessage,
} = require("../src/utils/message")
const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, "../public")
const port = process.env.PORT || 3000

app.use(express.static(publicDirPath))

io.on("connection", (socket) => {
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options })

    if (error) {
      return callback(error)
    }
    socket.join(user.room)

    socket.emit("message", generateMessage("Bot", "Welcome!"))
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Bot", `${user.username} has joined.`))

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
    callback()
  })

  socket.on("sendMessage", (message, callBack) => {
    const user = getUser(socket.id)

    io.to(user.room).emit("message", generateMessage(user.username, message))
    callBack("Delivered!")
  })

  socket.on("sendLocation", ({ latitude, longitude }, callBack) => {
    const user = getUser(socket.id)
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    )
    callBack()
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Bot", `${user.username} has left.`)
      )
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      })
    }
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}!`)
})
