# CineCatálogo com MySQL

Catálogo escolar com HTML, CSS, JavaScript, Node.js, Express e mysql2.

## Atualizar a versão anterior

1. No terminal do VS Code, pare o servidor com Ctrl+C.
2. Extraia este ZIP em uma nova pasta e abra essa pasta no VS Code. Não misture com o servidor antigo.
3. No MySQL Workbench, abra a mesma conexão usada para criar `catalogo_le5`.
4. Abra `sql/ajustar_banco_existente.sql` e execute uma vez. Ele habilita AUTO_INCREMENT em `obra.id_obra` sem apagar os registros. A coluna Extra do primeiro resultado deve mostrar `auto_increment`.
5. Se o ALTER der erro, execute `SET SESSION foreign_key_checks = 1;` para restaurar a verificação dessa sessão e peça ajuda com a mensagem. Não continue se houver erros.
6. Abra o terminal na pasta que contém `package.json` e execute `npm install`.
7. Execute `npm start`.
8. O terminal deve mostrar a conexão ao banco e o endereço http://localhost:3000.
9. Abra esse endereço no navegador. Mantenha o terminal aberto.

Não é necessário recriar o banco ou executar os INSERTs anteriores novamente. Esta versão usa o banco já criado. Node.js 18 ou superior é necessário para o Express 5.

## Configuração

A conexão em `index.js` usa localhost, porta 3306, usuário root, senha ifsp e banco catalogo_le5, conforme a configuração informada na aula. Se a senha local for outra, configure a variável DB_PASSWORD ou altere a configuração local. Não envie uma senha pessoal ao GitHub.

As variáveis opcionais são DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME e PORT. O acesso ao MySQL acontece no servidor Node, nunca nos scripts públicos.

## O que mudou

A lista em memória foi removida. As rotas agora executam SELECT, INSERT, UPDATE e DELETE na tabela `obra`. Os dados permanecem ao reiniciar o servidor. Os campos continuam sendo id_obra, titulo, tipo e ano_lancamento. Valores enviados pelo formulário usam parâmetros nas consultas SQL.

As tabelas usuario e avaliacao permanecem no banco. Como as 15 obras originais possuem avaliações, o banco impede sua exclusão. O site exibe uma mensagem explicando isso e mantém as avaliações. Para testar a exclusão, crie uma obra nova, que ainda não tenha avaliações.

## Conferir a integração

1. Abra o catálogo: devem aparecer as obras gravadas no MySQL.
2. Cadastre uma obra com o título Filme de teste, tipo Filme e ano 2026.
3. No Workbench, execute `SELECT * FROM catalogo_le5.obra ORDER BY id_obra;` e confira a nova obra.
4. Edite o título pelo site e execute novamente o SELECT.
5. Pare o Node com Ctrl+C, inicie com npm start e confira que a nova obra continua no catálogo.
6. Exclua apenas essa obra de teste. Confira no SELECT que ela foi removida.

## Arquivos

- index.js: conexão e rotas do servidor.
- public/: páginas, estilos e JavaScript do navegador.
- sql/ajustar_banco_existente.sql: ajuste do banco já existente.
- package.json e package-lock.json: dependências.
- .gitignore: evita enviar node_modules e arquivos locais.

Esta etapa integra apenas as obras. Não inclui telas de usuários ou avaliações. O GitHub guarda o código, mas GitHub Pages não executa este servidor Node.js.

## Validação

As rotas foram verificadas com uma conexão simulada, incluindo erros e uso de parâmetros. A conexão real e a migração devem ser confirmadas no MySQL do computador da aula.
