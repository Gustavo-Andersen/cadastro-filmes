const API_BASE_URL = 'http://localhost:8080/filme';

$(document).ready(function() {
    
    // Função para exibir alertas
    function exibirAlerta(mensagem, tipo = 'info') {
        const $alerta = $('#alertaCadastro');
        $alerta.removeClass().addClass(`alert alert-${tipo} mt-3`).text(mensagem).removeClass('d-none');
        setTimeout(() => $alerta.addClass('d-none'), 5000);
    }

    $('#formCadastrarFilme').on('submit', function(e) {
        e.preventDefault(); 

        const novoFilme = {
            titulo: $('#titulo').val(),
            sinopse: $('#sinopse').val(),
            genero: $('#genero').val(),
            lancamento: $('#lancamento').val() 
        };
        
        $.ajax({
            url: `${API_BASE_URL}/adicionar`,
            method: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify(novoFilme), 
            
            success: function(data) {
                exibirAlerta(`Filme "${data.titulo}" cadastrado com sucesso!`, 'success');
                $('#formCadastrarFilme')[0].reset();
            },
            error: function(xhr) {
                const mensagem = xhr.responseJSON ? xhr.responseJSON : 'Erro desconhecido ao cadastrar.';
                exibirAlerta(`Erro ao cadastrar filme: ${mensagem}`, 'danger');
            }
        });
    });
});