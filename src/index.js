const express = require('express'); //usado na construção da rota
const bodyParser = require('body-parser') //usado converter o body da requisição para o formato JSON

const app = express(); //habilita para a construção de rotas

app.use(bodyParser.json()); //converte o body da requisição para JSON
app.use(bodyParser.urlencoded({ extended: false}));

//usado unicamente para um teste visual
app.get('/', (req, res) => {
    res.send("OK")
});

//Recebe todas as rotas criadas pelo index.js
require('./app/controllers/index')(app);

//Servidor rodando na porta 3000
app.listen(3000);
