const socket = io()

const $messageForm = document.querySelector("#input-form")
const $messageInput = $messageForm.querySelector("input")
const $messageButton = $messageForm.querySelector("button")
const $messages = document.querySelector("#messages")
const $locationButton = document.querySelector("#send-location")
const $sideBar = document.querySelector("#sidebar")

//template
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sideBarTemplate = document.querySelector("#side-bar-template").innerHTML

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

socket.on("message", (message) => {
  console.log(message)

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    text: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  })
  $messages.insertAdjacentHTML("beforeend", html)
})

socket.on("locationMessage", (locationData) => {
  console.log(locationData)

  const html = Mustache.render(locationTemplate, {
    username: locationData.username,
    locationURL: locationData.url,
    createdAt: moment(locationData.createdAt).format("h:mm a"),
  })
  $messages.insertAdjacentHTML("beforeend", html)
})

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  })
  $sideBar.innerHTML = html
})

$messageForm.addEventListener("submit", (event) => {
  event.preventDefault()

  $messageButton.setAttribute("disabled", "disabled")

  socket.emit("sendMessage", $messageInput.value, (ackData) => {
    $messageButton.removeAttribute("disabled")
    $messageInput.value = ""
    $messageInput.focus()
    console.log(ackData)
  })
})

$locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("GeoLocation not Supported!")
  }

  $locationButton.setAttribute("disabled", "disabled")
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit(
      "sendLocation",
      {
        latitude,
        longitude,
      },
      () => {
        $locationButton.removeAttribute("disabled")
        console.log("Location Shared!")
      }
    )
  })
})

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = "/"
  }
})
