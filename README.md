# crudNode
Uma API em Node.js que realiza operações CRUD com MongoDB utilizando express.

- Instalar dependencias
`$ npm i`

- Rodar o servidor
`$ node src/index.js`

- Testes devem ser realizados no Postman, Insomnia ou similares

- Rotas para teste:
	- Registrar um usuário: http://localhost:3000/auth/register
	- Autenticar um usuário: http://localhost:3000/auth/authenticate
	- Esqueci minha senha: http://localhost:3000/auth/forgot_pass
	- Redefinir senha: http://localhost:3000/auth/reset_pass
	- Listar todos os projetos: http://localhost:3000/projects/
	- Exibir um unico projeto pelo seu ID: http://localhost:3000/projects/5ed513861830d3378db6bfea
	- Criar um projeto: http://localhost:3000/projects/
	- Atualizar um projeto pelo seu ID: http://localhost:3000/projects/5ed5141c1830d3378db6bff3
	- Deletar um projeto pelo seu ID: http://localhost:3000/projects/5ed5141c1830d3378db6bff3
