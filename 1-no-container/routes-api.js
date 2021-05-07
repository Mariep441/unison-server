const Users = require('./api/users');
const Tasks = require('./api/tasks');
const Processes = require('./api/processes');
const Feedbacks = require('./api/feedbacks');

module.exports = [
    { method: 'GET', path: '/api/users',config: Users.find },
    { method: 'GET', path: '/api/users/{email}', config: Users.findOne },
    { method: 'POST', path: '/api/users/{id}', config: Users.findOneAndUpdate },
    { method: 'POST', path: '/api/users', config: Users.signup },
    { method: 'POST', path: '/api/users/authenticate', config: Users.signin },
    { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
    { method: 'DELETE', path: '/api/users', config: Users.deleteAll },

    { method: 'GET', path: '/api/tasks', config: Tasks.find },
    { method: 'GET', path: '/api/tasks/{id}', config: Tasks.findOne },
    { method: 'POST', path: '/api/tasks/{id}', config: Tasks.findOneAndUpdate },
    { method: 'POST', path: '/api/tasks', config: Tasks.create },
    { method: 'DELETE', path: '/api/tasks/{id}', config: Tasks.deleteOne },
    { method: 'DELETE', path: '/api/tasks', config: Tasks.deleteAll },

    { method: 'GET', path: '/api/processes/{id}/tasks', config: Tasks.findByProcess },
    { method: 'POST', path: '/api/processes/{id}/tasks', config: Tasks.addTask },

    { method: 'GET', path: '/api/processes', config: Processes.find },
    { method: 'GET', path: '/api/processes/{id}', config: Processes.findOne },
    { method: 'POST', path: '/api/processes', config: Processes.create },
    { method: 'DELETE', path: '/api/processes/{id}', config: Processes.deleteOne },
    { method: 'DELETE', path: '/api/processes', config: Processes.deleteAll },

    { method: 'GET', path: '/api/feedbacks', config: Feedbacks.find },
    { method: 'GET', path: '/api/tasks/{id}/feedbacks', config: Feedbacks.findByTask },
    { method: 'POST', path: '/api/feedbacks', config: Feedbacks.create },
    { method: 'DELETE', path: '/api/feedbacks/{id}', config: Feedbacks.deleteOne },

    { method: 'GET', path: '/api/progress', config: Tasks.progress }
];
