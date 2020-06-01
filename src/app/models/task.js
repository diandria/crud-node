const mongoose = require('../../database'); //usado para conexão com banco de dados
const bcrypt = require('bcryptjs'); //usado para criptografar  a senha do usuario

//criação do campos
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task;
