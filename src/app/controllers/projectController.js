const express = require('express'); //usado na construção da rota
const authMiddleware = require('../middlewares/auth'); //usado para verificação do token, autorizando a credencial do usuario

const Project = require('../models/project'); //Parte de Projetos do banco de dados
const Task = require('../models/task') //Parte de Tarefas do banco de dados

const router = express.Router(); //Inicializa a rota

router.use(authMiddleware)

// Rota que lista todos os projetos existentes
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('user', 'tasks');

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects' })
    }
});

// Rota que exibe um determinado projeto pelo seu ID
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user', 'tasks');
        
        //retorna a lista de projetos existentes no banco de dados
        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading the project' })
    }
});

//  Rota que cadastra um projeto no banco de dados
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        //cadastra um novo projeto no banco de dados
        await Promise.all (tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        //salva o projeto no banco de dados
        await project.save();

        //retorna os dados do projeto na response
        return res.send({ project })
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating new project' })
    }
});

// Rota que atualiza informações do projeto no banco de dados
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        //encontra um projeto atraves do seu id
        const project = await Project.findByIdAndUpdate( req.params.projectId, {
            title, 
            description, 
            }, { new: true });
        
        project.tasks = [];
        await Task.remove({ project: project._id });

        //define os novos dados do projeto
        await Promise.all (tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            
            //atualiza a task no banco de dados
            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        // atualiza o projeto no banco de dados
        await project.save();

        return res.send({ project })
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error updating new project' })
    }
});

// Rota que deleta um projeto no banco de dados
router.delete('/:projectId', async (req, res) => {
    try {
        //deleta um projeto do banco de dados atraves do seu ID
        const project = await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project' })
    }
})

//Rota base de autorização localhost:3000/projects/<nomeDaRota>
module.exports = app => app.use('/projects', router);
