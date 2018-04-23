const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

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

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('created message: ', message);
        // io.emit() emits to all connections, whereas socket.emit() emits to a single connection
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // broadcast uses the same emit syntax, but will specifically avoid sending to the provided socket (will send to everyone else)
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});