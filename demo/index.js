const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/demo.html');
});
const userList = new Set()
io.on('connection', (socket) => {
  socket.join('demo', () => {
    const rooms = Object.keys(socket.rooms);
    if (!userList.has(rooms[0])) {
      userList.add(rooms[0])
    }
    io.to('demo').emit('message', {
      type: 'userAdd',
      data: [...userList]
    });
  })
  socket.on('disconnecting', (reason) => {
    const rooms = Object.keys(socket.rooms);
    if (userList.has(rooms[0])) {
      userList.delete(rooms[0])
    }
    io.to('demo').emit('message', {
      type: 'userRemove',
      data: [...userList]
    });
  });
  socket.on('message', (data) => {
    io.emit('message', data);
  })

})


http.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})