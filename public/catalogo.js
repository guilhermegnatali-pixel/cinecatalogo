const catalogo = document.getElementById('catalogo');
const mensagem = document.getElementById('mensagem');
const busca = document.getElementById('busca');
const filtro = document.getElementById('tipo-filtro');
let obras = [];

// textContent evita interpretar os títulos cadastrados como código HTML.
function mostrarObras() {
    catalogo.replaceChildren();
    const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
    const filtradas = obras.filter(obra =>
        obra.titulo.toLocaleLowerCase('pt-BR').includes(termo) &&
        (!filtro.value || obra.tipo === filtro.value)
    );
    document.getElementById('quantidade').textContent = `${filtradas.length} obra(s)`;
    mensagem.textContent = filtradas.length ? '' : 'Nenhuma obra encontrada.';

    filtradas.forEach(obra => {
        const cartao = document.createElement('article');
        cartao.className = 'cartao';
        const capa = document.createElement('div');
        capa.className = obra.tipo === 'Filme' ? 'capa filme' : 'capa serie';
        capa.setAttribute('aria-hidden', 'true');
        const simbolo = document.createElement('span');
        simbolo.className = 'simbolo';
        simbolo.textContent = obra.tipo === 'Filme' ? '▶' : '▤';
        const nomeCapa = document.createElement('span');
        nomeCapa.textContent = obra.titulo;
        capa.append(simbolo, nomeCapa);
        const conteudo = document.createElement('div');
        conteudo.className = 'conteudo';
        const detalhes = document.createElement('p');
        detalhes.className = 'detalhes';
        detalhes.textContent = `${obra.tipo} • ${obra.ano_lancamento}`;
        const titulo = document.createElement('h3');
        titulo.textContent = obra.titulo;
        const acoes = document.createElement('div');
        acoes.className = 'acoes';
        const editar = document.createElement('a');
        editar.href = `form.html?id=${obra.id_obra}`;
        editar.textContent = 'Editar';
        const excluir = document.createElement('button');
        excluir.type = 'button';
        excluir.className = 'excluir';
        excluir.textContent = 'Excluir';
        excluir.setAttribute('aria-label', `Excluir ${obra.titulo}`);
        excluir.addEventListener('click', async () => {
            if (!confirm(`Excluir "${obra.titulo}" do catálogo?`)) return;
            excluir.disabled = true;
            try {
                const resposta = await fetch(`/api/obras/${obra.id_obra}`, { method: 'DELETE' });
                if (!resposta.ok) {
                    const dados = await resposta.json();
                    throw new Error(dados.erro || 'Não foi possível excluir a obra.');
                }
                obras = obras.filter(item => item.id_obra !== obra.id_obra);
                mostrarObras();
                mensagem.textContent = 'Obra excluída.';
            } catch (erro) {
                mensagem.textContent = erro.message;
                excluir.disabled = false;
            }
        });
        acoes.append(editar, excluir);
        conteudo.append(detalhes, titulo, acoes);
        cartao.append(capa, conteudo);
        catalogo.append(cartao);
    });
}

async function carregarObras() {
    try {
        const resposta = await fetch('/api/obras');
        if (!resposta.ok) throw new Error('Não foi possível carregar o catálogo.');
        obras = await resposta.json();
        mostrarObras();
    } catch (erro) {
        mensagem.textContent = 'Não foi possível carregar o catálogo. Confira se o servidor está rodando e atualize a página.';
    }
}

busca.addEventListener('input', mostrarObras);
filtro.addEventListener('change', mostrarObras);
carregarObras();
