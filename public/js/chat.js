const socket = io()

socket.on("message", (message) => {
  console.log(message)
})

document.querySelector("#input-form").addEventListener("submit", (event) => {
  event.preventDefault()
  const inputBox = document.querySelector("#message-box")

  socket.emit("sendMessage", inputBox.value)
})

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("GeoLocation not Supported!")
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit("sendLocation", {
      latitude,
      longitude,
    })
  })
})
