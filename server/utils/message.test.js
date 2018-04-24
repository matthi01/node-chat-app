const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'test@test.test';
        let text = 'this is a testing message';
        let objMessage = generateMessage(from, text);
        expect(objMessage).toBeTruthy();
        expect(objMessage.from).toEqual(from);
        expect(objMessage.text).toEqual(text);
        expect(typeof objMessage.createdAt).toEqual('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        let from = 'test@test.test';
        let latitude = '1';
        let longitude = '2';
        let url = 'https://www.google.com/maps?q=1,2';
        let objMessage = generateLocationMessage(from, latitude, longitude);
        expect(objMessage).toBeTruthy();
        expect(objMessage.from).toEqual(from);
        expect(objMessage.url).toEqual(url);
        expect(typeof objMessage.createdAt).toEqual('number');
    });
});