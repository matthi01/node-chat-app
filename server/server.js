const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
// http and createServer is already used in the background with express, but need to make some changes to integrate socket io
const server = http.createServer(app);
const io = socketIO(server); //returns web socket server
let users = new Users();

//express static middleware to server up the public folder
app.use(express.static(publicPath));

//io.on() lets you initialize an event listener
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        // validate params
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('created message: ', message);
        // io.emit() emits to all connections, whereas socket.emit() emits to a single connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback() // acknowledgement
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});