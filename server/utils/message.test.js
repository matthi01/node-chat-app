const expect = require('expect');

const {generateMessage} = require('./message');

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