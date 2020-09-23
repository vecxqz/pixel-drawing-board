const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/demo.html');
});

io.on('connection', (socket) => {
  socket.join('demo', () => {
    io.to('demo').emit('a new user has joined the demo room')
  })
  socket.on('message', (data) => {
    io.emit('message', data);
  })
})

http.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})