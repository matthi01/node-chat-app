
let socket = io(); // initiate request from client to server to open up a web socket and keep connection open

socket.on('connect', () => {
    console.log('Connected to server');
});


// LISTENER - NEW MESSAGE
socket.on('newMessage', (message) => {
    console.log('new message: ', message);
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});


// LISTENER - NEW LOCATION MESSAGE
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


//SUBMIT BUTTON
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('');
    });
});


//LOCATION BUTTON
const locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    };

    // disable location button while the request is being filled
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    // takes two functions - success and fail
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});