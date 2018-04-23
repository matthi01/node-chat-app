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

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});