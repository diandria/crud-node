const mongoose = require('mongoose'); //usado para utilização do banco de dados

// realiza a conexão com o banco de dados
mongoose.connect('mongodb+srv://diandria:admin@crudnode-ulwza.mongodb.net/test?retryWrites=true&w=majority', {
    // configurações base do banco de dados (atualizado)
    keepAlive: true, 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose
