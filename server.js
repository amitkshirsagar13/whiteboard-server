const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});


// array of all lines drawn
var line_history = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    // first send the history to the new client
    for (var i in line_history) {
        socket.emit('draw-sync', { line: line_history[i] });
    }

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('draw', (data) => {
        console.log(JSON.stringify(data));
        line_history.push(data);
        io.emit('draw-sync', { line: data });
    });
});