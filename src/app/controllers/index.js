const fs = require('fs');
const path = require('path');

//Recebe todas as rotas criadas de forma automatica ignnorando o arquivo index.js
module.exports = app => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app));
};
