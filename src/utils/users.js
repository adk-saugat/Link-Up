const users = []

const addUser = ({ id, username, room }) => {
  //Clean data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  //Validate Data
  if (!username || !room) {
    return {
      error: "Username and Room are required!",
    }
  }

  //Check for existing User
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  )

  if (existingUser) {
    return {
      error: "Username is in use!",
    }
  }

  //Storing User
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const existingUserIndex = users.findIndex((user) => user.id === id)

  if (existingUserIndex !== -1) {
    return users.splice(existingUserIndex, 1)[0]
  }
}

const getUser = (id) => {
  const existingUser = users.find((user) => user.id === id)

  if (existingUser) {
    return existingUser
  }
}

const getUsersInRoom = (room) => {
  const usersInRoom = users.filter((user) => user.room === room.toLowerCase())

  return usersInRoom
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
}
