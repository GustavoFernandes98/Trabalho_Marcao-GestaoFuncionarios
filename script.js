document.addEventListener("DOMContentLoaded", function () {

    // Filtro de Funcionários
    const inputFiltroNome = document.getElementById('filtroNome');
    const inputFiltroVacina = document.getElementById('filtroVacina');
    const tabelaFuncionarios = document.getElementById('tabela-funcionarios');
    
    inputFiltroNome.addEventListener('change', function () {
        const filtroNome = inputFiltroNome.value.toLowerCase(); // Termo de filtro
        const linhas = tabelaFuncionarios.getElementsByTagName('tr'); // Linhas da tabela

        // Percorrendo todas as linhas da tabela
        for (let i = 0; i < linhas.length; i++) {
            const nomeFuncionario = linhas[i].getElementsByTagName('td')[1]; // Nome está na segunda coluna (índice 1)
            
            if (nomeFuncionario) {
                const nomeText = nomeFuncionario.textContent.toLowerCase();
                
                // Verifica se o nome do funcionário contém o termo de filtro
                if (nomeText.indexOf(filtroNome) > -1) {
                    linhas[i].style.display = ''; // Exibe a linha
                } else {
                    linhas[i].style.display = 'none'; // Esconde a linha
                }
            }
        }
    });

    inputFiltroVacina.addEventListener('change', function () {
        const filtroVacina = inputFiltroVacina.value.toLowerCase(); // Termo de filtro
        const linhas = tabelaFuncionarios.getElementsByTagName('tr'); // Linhas da tabela

        // Percorrendo todas as linhas da tabela
        for (let i = 0; i < linhas.length; i++) {
            const vacinaFuncionario = linhas[i].getElementsByTagName('td')[6]; // Tipo de vacina está na sétima coluna (índice 6)
            
            if (vacinaFuncionario) {
                const vacinaText = vacinaFuncionario.textContent.toLowerCase();
                
                // Verifica se o tipo de vacina do funcionário contém o termo de filtro
                if (vacinaText.indexOf(filtroVacina) > -1) {
                    linhas[i].style.display = ''; // Exibe a linha
                } else {
                    linhas[i].style.display = 'none'; // Esconde a linha
                }
            }
        }
    });

    // Função de Validação de Formulário
    function validarCPF(cpf) {
        return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf);
    }

    function validarTelefone(telefone) {
        return /\(\d{2}\)\s\d{5}-\d{4}/.test(telefone);
    }

    function validarEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    // Função para validar o formulário de "Cadastrar Funcionário"
    function validarCadastrarFuncionario(event) {
        let isValid = true;

        const nome = document.getElementById("nome").value;
        const registro = document.getElementById("registro").value;
        const cpf = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const secao = document.getElementById("secao").value;

        if (nome.trim() === "") {
            alert("O nome é obrigatório.");
            isValid = false;
        }
        if (registro.trim() === "" || isNaN(registro)) {
            alert("O número de registro é obrigatório e deve ser um número válido.");
            isValid = false;
        }
        if (!validarCPF(cpf)) {
            alert("O CPF deve estar no formato correto.");
            isValid = false;
        }
        if (!validarEmail(email)) {
            alert("Por favor, insira um email válido.");
            isValid = false;
        }
        if (!validarTelefone(telefone)) {
            alert("O telefone deve estar no formato (XX) XXXXX-XXXX.");
            isValid = false;
        }
        if (secao.trim() === "") {
            alert("A seção é obrigatória.");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        } else {
            adicionarFuncionarioNaTabela(nome, cpf, email, telefone, secao);
        }
    }

    // Adiciona um novo funcionário na tabela
    function adicionarFuncionarioNaTabela(nome, cpf, email, telefone, secao) {
        const novaLinha = document.createElement('tr');
        const tdId = document.createElement('td');
        tdId.textContent = tabelaFuncionarios.rows.length + 1; 
        novaLinha.appendChild(tdId);

        const tdNome = document.createElement('td');
        tdNome.textContent = nome;
        novaLinha.appendChild(tdNome);

        const tdCpf = document.createElement('td');
        tdCpf.textContent = cpf;
        novaLinha.appendChild(tdCpf);

        const tdEmail = document.createElement('td');
        tdEmail.textContent = email;
        novaLinha.appendChild(tdEmail);

        const tdTelefone = document.createElement('td');
        tdTelefone.textContent = telefone;
        novaLinha.appendChild(tdTelefone);

        const tdSecao = document.createElement('td');
        tdSecao.textContent = secao;
        novaLinha.appendChild(tdSecao);

        const tdTipoVacina = document.createElement('td');
        tdTipoVacina.textContent = "N/A";
        novaLinha.appendChild(tdTipoVacina);

        const tdAcoes = document.createElement('td');
        tdAcoes.innerHTML = '<a href="#">Editar</a> | <a href="#">Excluir</a>';
        novaLinha.appendChild(tdAcoes);

        tabelaFuncionarios.appendChild(novaLinha);
    }

    // Eventos de validação para o formulário
    const formCadastrar = document.getElementById("formCadastrar");
    if (formCadastrar) formCadastrar.addEventListener("submit", validarCadastrarFuncionario);

    // Agendamento de vacina - valida data futura
    function validarDataFutura(event) {
        const dataAgendamento = new Date(document.getElementById("dataAgendamento").value);
        const dataAtual = new Date();

        if (dataAgendamento <= dataAtual) {
            alert("A data do agendamento deve ser uma data futura.");
            event.preventDefault();
        }
    }

    const formAgendarVacina = document.getElementById("formAgendarVacina");
    if (formAgendarVacina) formAgendarVacina.addEventListener("submit", validarDataFutura);
    function carregarFuncionarios() {
        fetch('https://api.exemplo.com/funcionarios')
            .then(response => response.json())
            .then(data => {
                const selectFuncionario = document.getElementById('funcionarioVacinado');
                data.forEach(funcionario => {
                    const option = document.createElement('option');
                    option.value = funcionario.id;
                    option.textContent = funcionario.nome;
                    selectFuncionario.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar funcionários:', error));
    }
    
    document.addEventListener('DOMContentLoaded', carregarFuncionarios);
    

});
