const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const porta = process.env.PORT || 3000;

// Conexão com o banco criado na atividade de Banco de Dados.
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'ifsp',
    database: process.env.DB_NAME || 'catalogo_le5',
    charset: 'utf8mb4'
});

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function validarObra(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        return 'Envie os dados da obra.';
    }
    if (typeof dados.titulo !== 'string' || !dados.titulo.trim() || dados.titulo.trim().length > 100) {
        return 'O título deve ter entre 1 e 100 caracteres.';
    }
    if (!['Filme', 'Série'].includes(dados.tipo)) {
        return 'Escolha Filme ou Série.';
    }
    if (!Number.isInteger(dados.ano_lancamento) || dados.ano_lancamento < 1888 || dados.ano_lancamento > 2100) {
        return 'O ano deve ser um número inteiro entre 1888 e 2100.';
    }
    return null;
}

function validarId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
        return res.status(400).json({ erro: 'Identificação inválida.' });
    }
    next();
}

app.get('/api/obras', (req, res, next) => {
    db.execute('SELECT * FROM obra ORDER BY id_obra', (erro, obras) => {
        if (erro) return next(erro);
        res.json(obras);
    });
});

app.get('/api/obras/:id', validarId, (req, res, next) => {
    db.execute('SELECT * FROM obra WHERE id_obra = ?', [Number(req.params.id)], (erro, obras) => {
        if (erro) return next(erro);
        if (!obras.length) return res.status(404).json({ erro: 'Obra não encontrada.' });
        res.json(obras[0]);
    });
});

app.post('/api/obras', (req, res, next) => {
    const erro = validarObra(req.body);
    if (erro) return res.status(400).json({ erro });
    const titulo = req.body.titulo.trim();
    const { tipo, ano_lancamento } = req.body;
    const sql = 'INSERT INTO obra (titulo, tipo, ano_lancamento) VALUES (?, ?, ?)';
    db.execute(sql, [titulo, tipo, ano_lancamento], (erro, resultado) => {
        if (erro) return next(erro);
        res.status(201).json({ id_obra: resultado.insertId, titulo, tipo, ano_lancamento });
    });
});

app.put('/api/obras/:id', validarId, (req, res, next) => {
    const erro = validarObra(req.body);
    if (erro) return res.status(400).json({ erro });
    const id = Number(req.params.id);
    const titulo = req.body.titulo.trim();
    const { tipo, ano_lancamento } = req.body;
    const sql = 'UPDATE obra SET titulo = ?, tipo = ?, ano_lancamento = ? WHERE id_obra = ?';
    db.execute(sql, [titulo, tipo, ano_lancamento, id], (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: 'Obra não encontrada.' });
        res.json({ id_obra: id, titulo, tipo, ano_lancamento });
    });
});

app.delete('/api/obras/:id', validarId, (req, res, next) => {
    db.execute('DELETE FROM obra WHERE id_obra = ?', [Number(req.params.id)], (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado.affectedRows) return res.status(404).json({ erro: 'Obra não encontrada.' });
        res.status(204).end();
    });
});

app.use('/api', (req, res) => {
    res.status(404).json({ erro: 'Endereço não encontrado.' });
});

app.use((erro, req, res, next) => {
    if (erro.type === 'entity.too.large') {
        return res.status(413).json({ erro: 'Dados muito grandes.' });
    }
    if (erro.type === 'entity.parse.failed') {
        return res.status(400).json({ erro: 'Formato JSON inválido.' });
    }
    if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ erro: 'Esta obra possui avaliações e não pode ser excluída.' });
    }
    if (erro.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        return res.status(500).json({ erro: 'Execute o arquivo sql/ajustar_banco_existente.sql no Workbench para habilitar o cadastro.' });
    }
    console.error('Erro na operação:', erro.code || erro.message);
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' });
});

// Só inicia o site se a conexão com o banco funcionar.
db.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco:', erro.message);
        db.destroy();
        process.exitCode = 1;
        return;
    }
    console.log('Conectado ao banco catalogo_le5');
    app.listen(porta, () => {
        console.log(`CineCatálogo disponível em http://localhost:${porta}`);
    });
});
