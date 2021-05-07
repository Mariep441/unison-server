'use strict';

const assert = require('chai').assert;
const UnisonService = require('./unison-service');
const fixtures = require('./fixtures.json');
const utils = require('../api/utils.js');
const _ = require('lodash');

suite('Unison API tests', function() {

    let tasks = fixtures.tasks;
    let processes = fixtures.processes;
    let users = fixtures.users;
    let newProcess = fixtures.newProcess;
    let newUser = fixtures.newUser;

    const unisonService = new UnisonService(fixtures.unisonService);

    suiteSetup(async function() {
        await unisonService.deleteAllUsers();
        const returnedUser = await unisonService.createUser(newUser);
        const response = await unisonService.authenticate(newUser);
    });

    suiteTeardown(async function() {
        await unisonService.deleteAllUsers();
        unisonService.clearAuth();
    });

    setup(async function() {
        unisonService.deleteAllProcesses();
        unisonService.deleteAllTasks();
    });

    teardown(async function() {});


    test('authenticate', async function () {
        const returnedUser = await unisonService.createUser(newUser[0]);
        const response = await unisonService.authenticate(newUser[0]);
        assert(response.success);
        assert.isDefined(response.token);
    });

    test('verify Token', async function () {
        const returnedUser = await unisonService.createUser(newUser[1]);
        const response = await unisonService.authenticate(newUser[1]);
        const userInfo = utils.decodeToken(response.token);
        assert.equal(userInfo.email, returnedUser.email);
        assert.equal(userInfo.userId, returnedUser._id);
    });


    test('create a task', async function() {
        const returnedUser = await unisonService.createUser(newUser[1]);
        const response = await unisonService.authenticate(newUser[1]);
        const returnedProcess = await unisonService.createProcess(newProcess);
        await unisonService.addTask(returnedProcess._id, tasks[0]);
        const returnedTasks = await unisonService.getTasks(returnedProcess._id);
        assert.equal(returnedTasks.length, 1)
        assert(_.some([returnedTasks[0], tasks[0]]), 'returned task must be a superset of task');
    });

    test('create multiple tasks', async function() {
        const returnedUser = await unisonService.createUser(newUser[1]);
        const response = await unisonService.authenticate(newUser[1]);
        const returnedProcess = await unisonService.createProcess(newProcess);
        for (var i = 0; i < tasks.length; i++) {
            await unisonService.addTask(returnedProcess._id, tasks[i]);
        }
        const returnedTasks = await unisonService.getTasks(returnedProcess._id);
        assert.equal(returnedTasks.length, tasks.length);

        for (var i = 0; i < tasks.length; i++) {
            assert(_.some([returnedTasks[i], tasks[i]]), 'returned donation must be a superset of donation');
        }
    });

    test('delete all tasks', async function() {
        const returnedUser = await unisonService.createUser(newUser[1]);
        const response = await unisonService.authenticate(newUser[1]);
        const returnedProcess = await unisonService.createProcess(newProcess);
        for (var i = 0; i < tasks.length; i++) {
            await unisonService.addTask(returnedProcess._id, tasks[i]);
        }
        const t1 = await unisonService.getTasks(returnedProcess._id);
        assert.equal(t1.length, tasks.length);
        await unisonService.deleteAllTasks();
        const t2 = await unisonService.getTasks(returnedProcess._id);
        assert.equal(t2.length, 0);
    });

    test('create a task and check maker', async function() {
        const returnedUser = await unisonService.createUser(newUser[1]);
        const response = await unisonService.authenticate(newUser[1]);
        const returnedProcess = await unisonService.createProcess(newProcess);
        await unisonService.addTask(returnedProcess._id, tasks[0]);
        const returnedTasks = await unisonService.getTasks(returnedProcess._id);
        assert.isDefined(returnedTasks[0].creator);

        const users = await unisonService.getUsers();
        assert(_.some([users[0], newUser]), 'returnedUser must be a superset of newUser');
    });

    test('create a user', async function() {
        const returnedUser = await unisonService.createUser(newUser[2]);
        assert.equal(newUser[2].email, returnedUser.email);
        assert.equal(newUser[2].firstName, returnedUser.firstName);
        assert.equal(newUser[2].lastName, returnedUser.lastName);
        assert.isDefined(returnedUser._id);
    });

    test('get user', async function() {
        const u1 = await unisonService.createUser(newUser[3]);
        const u2 = await unisonService.getUser(u1.email);
        assert.deepEqual(u1, u2);
    });

    test('get invalid user', async function() {
        const u1 = await unisonService.getUser('1234');
        assert.isNull(u1);
        const u2 = await unisonService.getUser('012345678901234567890123');
        assert.isNull(u2);
    });

    test('delete a user', async function() {
        let u = await unisonService.createUser(newUser[4]);
        assert(u._id != null);
        await unisonService.deleteOneUser(u._id);
        u = await unisonService.getUser(u._id);
        assert(u == null);
    });

    test('get all users', async function() {
        await unisonService.deleteAllUsers();
        await unisonService.createUser(newUser[0]);
        await unisonService.authenticate(newUser[0]);
        for (let u of users) {
            await unisonService.createUser(u);
        }

        const allUsers = await unisonService.getUsers();
        assert.equal(allUsers.length, users.length + 1);
    });

    test('get users detail', async function() {
        await unisonService.deleteAllUsers();
        const user = await unisonService.createUser(newUser[1]);
        await unisonService.authenticate(newUser[1]);
        for (let u of users) {
            await unisonService.createUser(u);
        }

        const testUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password:  user.password,
        };
        users.unshift(testUser);
        const allUsers = await unisonService.getUsers();
        for (var i = 0; i < users.length; i++) {

            assert.equal([allUsers[i]].email, [users[i]].email);
            assert.equal([allUsers[i]].firstName, [users[i]].firstName);
            assert.equal([allUsers[i]].lastName, [users[i]].lastName);
        }
    });

    test('get all users empty', async function() {
        await unisonService.deleteAllUsers();
        const user = await unisonService.createUser(newUser[6]);
        const response = await unisonService.authenticate(newUser[6]);
        const allUsers = await unisonService.getUsers();
        assert.equal(allUsers.length, 1);
    });
});
