const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
server.listen(process.env.PORT || 3000, () => console.log('server started'));

app.get('/', (req, res) => res.render('home'));

const arrUsername = [];

io.on('connection', socket => {
    socket.on('NEW_USER_SIGN_UP', username => {
        if (arrUsername.indexOf(username) === -1) {
            socket.emit('SERVER_CONFIRM_USERNAME', true);
            return arrUsername.push(username);
        }
        socket.emit('SERVER_CONFIRM_USERNAME', false);
    });

    socket.on('CLIENT_JOIN_ROOM', roomObj => {
        const { roomName, oldRoom } = roomObj;
        socket.leave(oldRoom);
        socket.join(roomName);
    });

    socket.on('CLIENT_SEND_MESSAGE', msgOject => {
        const { roomName, message } = msgOject;
        io.in(roomName).emit('SERVER_SEND_NEW_MESSAGE', message);
    });
});
