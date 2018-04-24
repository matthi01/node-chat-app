const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Test Name 1',
            room: 'Test Room 1'
        }, {
            id: '2',
            name: 'Test Name 2',
            room: 'Test Room 2'
        }, {
            id: '3',
            name: 'Test Name 3',
            room: 'Test Room 1'
        }];
    });

    it('should add new user', () => {
        let users = new Users();
        let testUser = {
            id: '1',
            name: 'test name',
            room: 'test room'
        }
        users.addUser(testUser.id, testUser.name, testUser.room);
        expect(users.users).toEqual([testUser]);
    });

    it('should remove a user', () => {
        let userId = '2';
        let user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        let userId = '999';
        let user = users.removeUser(userId);
        expect(users.users.length).toBe(3);
    });

    it('should get user', () => {
        let userId = '2';
        let user = users.getUser(userId);
        expect(user.id).toBe(userId);
    });

    it('should not get user', () => {
        let userId = '999';
        let user = users.getUser(userId);
        expect(user).toBeFalsy;
    });

    it('should return names for Test Room 1', () => {
        let userList = users.getUserList('Test Room 1');
        expect(userList).toEqual(['Test Name 1', 'Test Name 3']);
    });

    it('should return names for Test Room 2', () => {
        let userList = users.getUserList('Test Room 2');
        expect(userList).toEqual(['Test Name 2']);
    });

});