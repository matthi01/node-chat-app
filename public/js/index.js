
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

socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);

    li.append(a);
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

const locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    };

    // takes two functions - success and fail
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        alert('Unable to fetch location');
    });
});