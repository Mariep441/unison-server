const Feedbacks = require('./api/feedbacks');

module.exports = [

    { method: 'GET', path: '/api/feedbacks', config: Feedbacks.find },
    { method: 'GET', path: '/api/tasks/{id}/feedbacks', config: Feedbacks.findByTask },
    { method: 'POST', path: '/api/feedbacks', config: Feedbacks.create },
    { method: 'DELETE', path: '/api/feedbacks/{id}', config: Feedbacks.deleteOne },

];
