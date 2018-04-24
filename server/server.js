const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
// http and createServer is already used in the background with express, but need to make some changes to integrate socket io
const server = http.createServer(app);
const io = socketIO(server); //returns web socket server

//express static middleware to server up the public folder
app.use(express.static(publicPath));

//io.on() lets you initialize an event listener
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

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
    });
});


server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});