const jwt = require('jsonwebtoken'); //usado para criação e autenticação de um token
const authConfig = require('../../config/auth.json') //hash secret usado para a construção do token

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //verifica se foi informado um token
    if (!authHeader)
        return res.status(401).send({ error: 'No token provided' });

    const parts = authHeader.split(' ');

    // verifica se o token é o formato bearer {ex: bearer sduhfurf87re87f8hfr8} de tamanho 2
    if (!parts.length == 2)
        return res.status(401).send({ error: 'Token error' });

    const [ scheme, token ] = parts;

    // verifica se o token esta bem formatado
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' });

    //verifica se o token é válido
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' });

        req.userId = decoded.id;
        //se o token é válido o usuário esta autenticado
        return next();
    })
};
