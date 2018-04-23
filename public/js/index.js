
let socket = io(); // initiate request from client to server to open up a web socket and keep connection open

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('newMessage', (message) => {
    console.log('new message: ', message);
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {

    });
});