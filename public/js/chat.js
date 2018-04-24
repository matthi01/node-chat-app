
let socket = io(); // initiate request from client to server to open up a web socket and keep connection open

// auto scroll - make sure to only scroll to the bottom if user is already viewing the last message (vs checking out the history of messages)
const scrollToBottom = () => {
    // selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');

    // heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    console.log('Connected to server');
});


// LISTENER - NEW MESSAGE
socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});


// LISTENER - NEW LOCATION MESSAGE
socket.on('newLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
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