const formulario = document.getElementById('formulario');
const mensagem = document.getElementById('mensagem');
const salvar = document.getElementById('salvar');
const id = new URLSearchParams(window.location.search).get('id');

async function carregarEdicao() {
    if (!id) return;
    document.getElementById('titulo-pagina').textContent = 'Editar obra';
    salvar.disabled = true;
    try {
        const resposta = await fetch(`/api/obras/${encodeURIComponent(id)}`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro);
        formulario.elements.titulo.value = dados.titulo;
        formulario.elements.tipo.value = dados.tipo;
        formulario.elements.ano_lancamento.value = dados.ano_lancamento;
        salvar.disabled = false;
    } catch (erro) {
        mensagem.textContent = 'Não foi possível abrir a obra para edição. Volte ao catálogo e tente novamente.';
    }
}

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const obra = {
        titulo: formulario.elements.titulo.value.trim(),
        tipo: formulario.elements.tipo.value,
        ano_lancamento: Number(formulario.elements.ano_lancamento.value)
    };
    if (!obra.titulo) {
        mensagem.textContent = 'Informe um título, sem usar apenas espaços.';
        return;
    }
    salvar.disabled = true;
    mensagem.textContent = 'Salvando...';
    try {
        const resposta = await fetch(id ? `/api/obras/${encodeURIComponent(id)}` : '/api/obras', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obra)
        });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível salvar.');
        window.location.href = 'index.html';
    } catch (erro) {
        mensagem.textContent = erro instanceof TypeError ? 'Sem conexão com o servidor. Confira o terminal e tente novamente.' : erro.message;
        salvar.disabled = false;
    }
});

carregarEdicao();
