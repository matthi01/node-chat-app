const expect = require('expect');

const {isRealString} = require('./validation');

describe('validation: isRealString', () => {
    it('should reject non-string values', () => {
        let result = isRealString(12345);
        expect(result).toEqual(false);
    });

    it('should reject string with only spaces', () => {
        let result = isRealString(          );
        expect(result).toEqual(false);
    });

    it('should allow string with non-space characters', () => {
        let result = isRealString('test test test');
        expect(result).toEqual(true);
    });
});