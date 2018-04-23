
let socket = io(); // initiate request from client to server to open up a web socket and keep connection open

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('newMessage', (message) => {
    console.log('new message: ', message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});