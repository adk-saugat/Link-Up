const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const {
  generateMessage,
  generateLocationMessage,
} = require("../src/utils/message")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, "../public")
const port = 3000

app.use(express.static(publicDirPath))

io.on("connection", (socket) => {
  socket.emit("message", generateMessage("Welcome!"))

  socket.broadcast.emit("message", generateMessage("A new user has joined!"))

  socket.on("sendMessage", (message, callBack) => {
    io.emit("message", generateMessage(message))
    callBack("Delivered!")
  })

  socket.on("sendLocation", ({ latitude, longitude }, callBack) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    )
    callBack()
  })

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left."))
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}!`)
})
