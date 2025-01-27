const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, "../public")
const port = 3000

app.use(express.static(publicDirPath))

io.on("connection", (socket) => {
  socket.on("sendMessage", (message) => {
    io.emit("message", message)
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}!`)
})
