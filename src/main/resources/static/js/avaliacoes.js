const API_BASE_URL = 'http://localhost:8080/analise';

$(document).ready(function() {
    let idAtualParaEdicao = null;

    function exibirAlerta(mensagem, tipo = 'info') {
        const $alerta = $('#alertaAvaliacao');
        $alerta.removeClass().addClass(`alert alert-${tipo} mt-3`).text(mensagem).removeClass('d-none');
        setTimeout(() => $alerta.addClass('d-none'), 5000);
    }
    
    function criarLinhaTabela(avaliacao, id) {
        return `
            <tr data-id="${id}">
                <td>${id}</td>
                <td>${avaliacao.filmeTitulo}</td>
                <td>${avaliacao.nota}</td>
                <td>${avaliacao.texto}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar-avaliacao" 
                            data-id="${id}" 
                            data-nota="${avaliacao.nota}" 
                            data-texto="${avaliacao.texto}"
                            data-bs-toggle="modal" 
                            data-bs-target="#modalEditarAvaliacao">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-deletar-avaliacao" data-id="${id}">Deletar</button>
                </td>
            </tr>
        `;
    }

    $('#btnPesquisarAvaliacao').on('click', function() {
        const id = $('#avaliacaoIdPesquisa').val().trim();
        $('#detalheAvaliacao').empty();

        if (!id) {
            exibirAlerta('Por favor, digite o ID da avaliação.', 'warning');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/pesquisar/${id}`,
            method: 'GET',
            success: function(avaliacao) {
                const htmlResultado = `
                    <div class="card avaliacao-card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-info">Resultado da Pesquisa (ID: ${id})</h5>
                            <p><strong>Filme:</strong> ${avaliacao.filmeTitulo}</p>
                            <p><strong>Nota:</strong> ${avaliacao.nota}</p>
                            <p><strong>Texto:</strong> ${avaliacao.texto}</p>
                            <button class="btn btn-warning btn-sm btn-editar-avaliacao" 
                                    data-id="${id}" 
                                    data-nota="${avaliacao.nota}" 
                                    data-texto="${avaliacao.texto}"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modalEditarAvaliacao">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-deletar-avaliacao" data-id="${id}">Deletar</button>
                        </div>
                    </div>
                `;
                $('#detalheAvaliacao').html(htmlResultado);
                exibirAlerta('Avaliação encontrada.', 'success');
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro ao buscar a avaliação.';
                exibirAlerta(mensagem, 'danger');
            }
        });
    });
    
    $('#btnListarTodasAvaliacoes').on('click', function() {
        $.ajax({
            url: `${API_BASE_URL}/listar`,
            method: 'GET',
            success: function(avaliacoes) {
                const $tbody = $('#tabelaAvaliacoesBody');
                $tbody.empty();
                
                if (avaliacoes.length === 0) {
                     $tbody.html('<tr><td colspan="5" class="text-center">Nenhuma avaliação encontrada.</td></tr>');
                     exibirAlerta('Nenhuma avaliação cadastrada.', 'info');
                     return;
                }

                avaliacoes.forEach((avaliacao, index) => {
                    const idSimulado = index + 1; 
                    $tbody.append(criarLinhaTabela(avaliacao, idSimulado));
                });
                exibirAlerta(`Foram listadas ${avaliacoes.length} avaliações.`, 'success');
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao listar.';
                $('#tabelaAvaliacoesBody').html(`<tr><td colspan="5" class="text-center text-danger">${mensagem}</td></tr>`);
                exibirAlerta(`Erro ao listar: ${mensagem}`, 'danger');
            }
        });
    });

    $(document).on('click', '.btn-editar-avaliacao', function() {
        idAtualParaEdicao = $(this).data('id');
        const nota = $(this).data('nota');
        const texto = $(this).data('texto');

        $('#editarAvaliacaoId').text(idAtualParaEdicao);
        $('#editarAvaliacaoNota').val(nota);
        $('#editarAvaliacaoTexto').val(texto);
    });

    $('#btnSalvarEdicaoAvaliacao').on('click', function() {
        if (!idAtualParaEdicao) return;

        const novaNota = $('#editarAvaliacaoNota').val();
        const novoTexto = $('#editarAvaliacaoTexto').val();

        if (!novaNota || !novoTexto || novaNota < 1 || novaNota > 10) {
            alert('Por favor, preencha a nota (1 a 10) e o texto da avaliação.');
            return;
        }

        const analiseAtualizada = {
            texto: novoTexto,
            nota: parseInt(novaNota)
        };
        
        $.ajax({
            url: `${API_BASE_URL}/atualizar${idAtualParaEdicao}`, 
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(analiseAtualizada),
            success: function(data) {
                exibirAlerta(`Avaliação ID ${idAtualParaEdicao} atualizada com sucesso!`, 'success');
                $('#modalEditarAvaliacao').modal('hide');
                $('#btnListarTodasAvaliacoes').trigger('click');
                $('#detalheAvaliacao').empty();
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao atualizar.';
                exibirAlerta(`Erro ao atualizar avaliação: ${mensagem}`, 'danger');
            }
        });
    });
    
    $(document).on('click', '.btn-deletar-avaliacao', function() {
        const idParaDeletar = $(this).data('id');

        if (!confirm(`Tem certeza que deseja deletar a avaliação ID ${idParaDeletar}?`)) {
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/deletar${idParaDeletar}`,
            method: 'DELETE',
            success: function() {
                exibirAlerta(`Avaliação ID ${idParaDeletar} deletada com sucesso!`, 'success');
                $(`tr[data-id="${idParaDeletar}"]`).remove();
                if ($('#detalheAvaliacao').find(`[data-id="${idParaDeletar}"]`).length) {
                    $('#detalheAvaliacao').empty();
                }
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao deletar.';
                exibirAlerta(`Erro ao deletar avaliação: ${mensagem}`, 'danger');
            }
        });
    });
});