const path = require('path') //usado para manipulação de diretorios
const nodemailer = require('nodemailer'); //usado para o envio de emails
const hbs = require('nodemailer-express-handlebars'); //usado para gerar um email

// recebe as configurações do mail.json usado para o envio de email
const { host, port, user, pass } = require('../config/mail.json')

// configurações globais do mailtrap
const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
});

// configurações para gerar o email
const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: './src/resources/mail/auth/',
      layoutsDir: './src/resources/mail/auth/',
      defaultLayout: 'forgot_password.html',
    },
    viewPath: './src/resources/mail/',
    extName: '.html',
  };

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;
