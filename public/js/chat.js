const socket = io()

socket.on("message", (message) => {
  console.log(message)
})

document.querySelector("#input-form").addEventListener("submit", (event) => {
  event.preventDefault()
  const inputBox = document.querySelector("#message-box")

  socket.emit("sendMessage", inputBox.value)
})
