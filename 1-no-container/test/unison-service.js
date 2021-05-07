'use strict';

const axios = require('axios');

class UnisonService {constructor(baseUrl) {this.baseUrl = baseUrl;}

    async getUsers() {
        try {
            const response = await axios.get(this.baseUrl + '/api/users');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getUser(email) {
        try {
            const response = await axios.get(this.baseUrl + '/api/users/' + email);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createUser(newUser) {
        try {
            const response = await axios.post(this.baseUrl + '/api/users', newUser);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllUsers() {
        try {
            const response = await axios.delete(this.baseUrl + '/api/users');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteOneUser(id) {
        try {
            const response = await axios.delete(this.baseUrl + '/api/users/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getProcesses() {
        try {
            const response = await axios.get(this.baseUrl + '/api/processes');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getProcesses(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/processes/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createProcess(newProcess) {
        try {
            const response = await axios.post(this.baseUrl + '/api/processes', newProcess);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllProcesses() {
        try {
            const response = await axios.delete(this.baseUrl + '/api/candidates');
            return response.data;
        } catch (e) {
            return null;
        }
    }



    async addTask(id, task) {
        try {
            const response = await axios.post(this.baseUrl + '/api/processes/' + id + '/tasks',  task);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getTasks(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/processes/' + id + '/tasks');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllTasks() {
        try {
            const response = await axios.delete(this.baseUrl + '/api/tasks');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async authenticate(user) {
        try {
            const response = await axios.post(this.baseUrl + '/api/users/authenticate', user);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async clearAuth(user) {
        axios.defaults.headers.common['Authorization'] = '';
    }
}

module.exports = UnisonService;
