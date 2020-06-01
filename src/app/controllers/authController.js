const express = require('express'); //usado na construção da rota
const bcrypt = require('bcryptjs'); //usado para criptografar  a senha do usuario
const jwt = require('jsonwebtoken'); //usado para gerar o token de autenticação
const crypto = require('crypto'); //usado para criação do token de reset de senha
const mailer = require('../../modules/mailer'); //usado para integração do envio de email

const authConfig = require('../../config/auth.json') //hash secret utilizado no JWT

const User = require('../models/user'); //Parte de Usuários do banco de dados

const router = express.Router(); //Inicializa a rota

//Gera um token de autenticação atraves de hash quando o usuario se loga por 24h
function genereteToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

//Rota de crição de usuario
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        //verifica se o usuario ja existe atraves do email
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        //cria o usuario
        const user = await User.create(req.body);

        //não exibe a senha no momento da response
        user.password = undefined;
    
        //retorna os dados do usuario criado
        return res.send({ 
            user,
            token: genereteToken({ id: user.id}),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

//Rota de autenticação do usuário
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    //verifica se o usuario ja existe atraves do email
    if (!user)
        return res.status(400).send({ error: 'User not found' });

    //verifica se a senha está correta
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' });

    //não exibe a senha no momento da response
    user.password = undefined;
    
    //verifica o token de autenticação do usuario
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
    });

    //retorna os dados do usuario autenticado
    res.send({ 
        user, 
        token: genereteToken({ id: user.id}),
    });

});

//Rota "esqueci minha senha"
router.post('/forgot_pass', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne( { email });

        //verifica se o usuario ja existe atraves do email
        if (!user)
            return res.status(400).send({ error: 'User not found' });
        
        //gera um token que será usado para recuperação de senha
        const token = crypto.randomBytes(20).toString('hex');

        //pega o momento atual e adiciona 1h para o token expirar, o usuario só poderá resetar a senha nesse intervalo de hora
        const now = new Date();
        now.setHours(now.getHours() + 1);

        //encontra o usuario e insere o token e o tempo de expiração do token no banco de dados
        await User.findOneAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });
        
        //envia o token para o email do usuario
        mailer.sendMail({
            to: email,
            from: 'diandriaferreira@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });
            return res.send();
        })
    } catch (err) {
        res.status(400).send({ error: 'Erro on forgot password, try again' });
    }
});

//Rota que atualiza a senha no banco de dados
router.post('/reset_pass', async (req, res) => {
    const { email, token, password } = req.body

    try {
        const user = await User.findOne( { email } )
            .select('+passwordResetToken passwordResetExpires');

        //verifica se o usuario ja existe atraves do email
        if (!user)
            return res.status(400).send({ error: 'User not found' });
        
        //verifica se o token informado é válido
        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });
        
        //verifica se o token ainda esta válido
        const now = new Date();
        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generated a new one' });

        //define a nova senha
        user.password = password;

        //atualiza a senha no banco de dados
        await user.save();

        res.send();

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password, try again' })
    }
});

//Rota base de autorização localhost:3000/auth/<nomeDaRota>
module.exports = app => app.use('/auth', router);
