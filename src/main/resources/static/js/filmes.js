
const API_BASE_URL = 'http://localhost:8080/filme';
const API_ANALISE_URL = 'http://localhost:8080/analise';

$(document).ready(function() {
    let tituloAtual = ''; 


    function exibirAlerta(mensagem, tipo = 'info', idAlerta = 'alertaPesquisaFilme') {
        const $alerta = $(`#${idAlerta}`);
        $alerta.removeClass().addClass(`alert alert-${tipo} mt-3`).text(mensagem).removeClass('d-none');
        setTimeout(() => $alerta.addClass('d-none'), 5000);
    }

    function limparDetalhesFilme() {
        $('#detalhesFilme').addClass('d-none');
        $('#filmeTitulo, #filmeSinopse, #filmeGenero, #filmeLancamento').text('');
        tituloAtual = '';
    }

    $('#btnPesquisarFilme').on('click', function() {
        const titulo = $('#filmeTituloPesquisa').val().trim();
        if (!titulo) {
            exibirAlerta('Por favor, digite o título do filme.', 'warning');
            limparDetalhesFilme();
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/pesquisar`,
            method: 'GET',
            data: { titulo: titulo },
            success: function(filme) {
                tituloAtual = filme.titulo; 
                
                $('#filmeTitulo').text(filme.titulo);
                $('#filmeSinopse').text(filme.sinopse);
                $('#filmeGenero').text(filme.genero);
                $('#filmeLancamento').text(new Date(filme.lancamento).toLocaleDateString('pt-BR'));
                $('#detalhesFilme').removeClass('d-none');
                
                exibirAlerta('Filme encontrado com sucesso!', 'success');
            },
            error: function(xhr) {
                limparDetalhesFilme();
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro ao buscar o filme. Título não encontrado.';
                exibirAlerta(mensagem, 'danger');
            }
        });
    });

    $('#btnDeletarFilme').on('click', function() {
        if (!tituloAtual) {
            exibirAlerta('Nenhum filme selecionado para deletar.', 'warning');
            return;
        }

        if (!confirm(`Tem certeza que deseja deletar o filme "${tituloAtual}"? Isso pode falhar se houver avaliações vinculadas.`)) {
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/deletar`,
            method: 'DELETE',
            data: { titulo: tituloAtual },
            success: function() {
                exibirAlerta(`Filme "${tituloAtual}" deletado com sucesso!`, 'success');
                limparDetalhesFilme();
                $('#filmeTituloPesquisa').val('');
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao deletar.';
                exibirAlerta(`Erro ao deletar: ${mensagem}`, 'danger');
            }
        });
    });
    $('#btnEditarFilme').on('click', function() {
        if (!tituloAtual) {
            exibirAlerta('Nenhum filme selecionado para editar.', 'warning');
            return;
        }

        $('#editarTitulo').val(tituloAtual);
        $('#editarSinopse').val($('#filmeSinopse').text());
        $('#editarGenero').val($('#filmeGenero').text());
        
        const dataLancamentoFormatada = new Date($('#filmeLancamento').text().split('/').reverse().join('-'));
        const yyyy = dataLancamentoFormatada.getFullYear();
        const mm = String(dataLancamentoFormatada.getMonth() + 1).padStart(2, '0');
        const dd = String(dataLancamentoFormatada.getDate()).padStart(2, '0');
        $('#editarLancamento').val(`${yyyy}-${mm}-${dd}`);
    });
    
    $('#btnSalvarEdicaoFilme').on('click', function() {
        const novoTitulo = $('#editarTitulo').val();
        const sinopse = $('#editarSinopse').val();
        const genero = $('#editarGenero').val();
        const lancamento = $('#editarLancamento').val();

        const filmeAtualizado = {
            titulo: novoTitulo,
            sinopse: sinopse,
            genero: genero,
            lancamento: lancamento
        };
        
        $.ajax({
            url: `${API_BASE_URL}/atualizar?titulo=${tituloAtual}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(filmeAtualizado),
            success: function(data) {
                exibirAlerta(`Filme "${tituloAtual}" atualizado com sucesso!`, 'success');

                $('#modalEditarFilme').modal('hide');
                $('#filmeTituloPesquisa').val(novoTitulo);
                $('#btnPesquisarFilme').trigger('click');
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao atualizar.';
                exibirAlerta(`Erro ao atualizar filme: ${mensagem}`, 'danger', 'alertaPesquisaFilme');
            }
        });
    });

    $('#modalCriarAvaliacao').on('show.bs.modal', function() {
        if (!tituloAtual) {
            exibirAlerta('É necessário selecionar um filme para criar uma avaliação.', 'warning');
            return false;
        }
        $('#avaliacaoFilmeTitulo').text(tituloAtual);
        $('#formCriarAvaliacao')[0].reset(); 
    });

    $('#btnSalvarAvaliacao').on('click', function() {
        const nota = $('#avaliacaoNota').val();
        const texto = $('#avaliacaoTexto').val();

        if (!nota || !texto || nota < 1 || nota > 10) {
            alert('Por favor, preencha a nota (1 a 10) e o texto da avaliação.');
            return;
        }

        const novaAnalise = {
            texto: texto,
            nota: parseInt(nota)
        };

        $.ajax({
            url: `${API_ANALISE_URL}/adicionar?titulo=${tituloAtual}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(novaAnalise),
            success: function(data) {
                exibirAlerta(`Avaliação criada com sucesso para "${data.filmeTitulo}"!`, 'success', 'alertaPesquisaFilme');
                $('#modalCriarAvaliacao').modal('hide');
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao criar avaliação.';
                exibirAlerta(`Erro ao criar avaliação: ${mensagem}`, 'danger', 'alertaPesquisaFilme');
            }
        });
    });
});