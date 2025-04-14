// script.js completo atualizado com envio para API e listagem da API

document.addEventListener("DOMContentLoaded", function () {

    const inputFiltroNome = document.getElementById('filtroNome');
    const inputFiltroVacina = document.getElementById('filtroVacina');
    const tabelaFuncionarios = document.getElementById('tabela-funcionarios');

    function exibirMensagem(texto, classe) {
        const statusMensagem = document.getElementById("statusMensagem");
        if (statusMensagem) {
            statusMensagem.textContent = texto;
            statusMensagem.className = classe;
        }
    }

    function enviarParaAPI(endpoint, dados, callbackSucesso) {
        exibirMensagem("Enviando...", "status-enviando");
        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro na API");
            return res.json();
        })
        .then(data => {
            exibirMensagem("Dados salvos com sucesso!", "status-sucesso");
            if (callbackSucesso) callbackSucesso();
        })
        .catch(error => {
            console.error("Erro ao enviar para API:", error);
            exibirMensagem("Erro ao salvar. Tente novamente.", "status-erro");
        });
    }

    function adicionarFuncionarioNaTabela(nome, cpf, email, telefone, secao, vacina = "N/A", id = null) {
        if (!tabelaFuncionarios) return;
        const novaLinha = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = id || tabelaFuncionarios.rows.length + 1;
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
        tdTipoVacina.textContent = vacina;
        novaLinha.appendChild(tdTipoVacina);

        const tdAcoes = document.createElement('td');
        tdAcoes.innerHTML = '<a href="#">Editar</a> | <a href="#">Excluir</a>';
        novaLinha.appendChild(tdAcoes);

        tabelaFuncionarios.appendChild(novaLinha);
    }

    function carregarFuncionarios() {
        fetch('https://api.exemplo.com/funcionarios')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) return;
                tabelaFuncionarios.innerHTML = "";
                data.forEach(func => {
                    adicionarFuncionarioNaTabela(
                        func.nome,
                        func.cpf,
                        func.email,
                        func.telefone,
                        func.secao,
                        func.tipoVacina || "N/A",
                        func.id
                    );
                });
            })
            .catch(error => console.error('Erro ao carregar funcionários:', error));
    }

    carregarFuncionarios();

    if (inputFiltroNome && inputFiltroVacina && tabelaFuncionarios) {
        inputFiltroNome.addEventListener('change', function () {
            const filtroNome = inputFiltroNome.value.toLowerCase();
            const linhas = tabelaFuncionarios.getElementsByTagName('tr');
            for (let i = 0; i < linhas.length; i++) {
                const nomeFuncionario = linhas[i].getElementsByTagName('td')[1];
                if (nomeFuncionario) {
                    const nomeText = nomeFuncionario.textContent.toLowerCase();
                    linhas[i].style.display = nomeText.includes(filtroNome) ? '' : 'none';
                }
            }
        });

        inputFiltroVacina.addEventListener('change', function () {
            const filtroVacina = inputFiltroVacina.value.toLowerCase();
            const linhas = tabelaFuncionarios.getElementsByTagName('tr');
            for (let i = 0; i < linhas.length; i++) {
                const vacinaFuncionario = linhas[i].getElementsByTagName('td')[6];
                if (vacinaFuncionario) {
                    const vacinaText = vacinaFuncionario.textContent.toLowerCase();
                    linhas[i].style.display = vacinaText.includes(filtroVacina) ? '' : 'none';
                }
            }
        });
    }

    const formCadastrar = document.getElementById("formCadastrar");
    if (formCadastrar) {
        formCadastrar.addEventListener("submit", function (event) {
            event.preventDefault();

            const nome = document.getElementById("nome").value;
            const registro = document.getElementById("registro").value;
            const cpf = document.getElementById("cpf").value;
            const email = document.getElementById("email").value;
            const telefone = document.getElementById("telefone").value;
            const secao = document.getElementById("secao").value;

            let isValid = true;

            if (nome.trim() === "") { alert("Nome obrigatório"); isValid = false; }
            if (registro.trim() === "" || isNaN(registro)) { alert("Registro inválido"); isValid = false; }
            if (!validarCPF(cpf)) { alert("CPF inválido"); isValid = false; }
            if (!validarEmail(email)) { alert("Email inválido"); isValid = false; }
            if (!validarTelefone(telefone)) { alert("Telefone inválido"); isValid = false; }
            if (secao.trim() === "") { alert("Seção obrigatória"); isValid = false; }

            if (!isValid) return;

            const novoFuncionario = { nome, registro, cpf, email, telefone, secao };
            enviarParaAPI("https://api.exemplo.com/funcionarios", novoFuncionario, () => {
                formCadastrar.reset();
                carregarFuncionarios();
            });
        });
    }

    const formAgendarVacina = document.getElementById("formAgendarVacina");
    if (formAgendarVacina) {
        formAgendarVacina.addEventListener("submit", function (event) {
            event.preventDefault();
            const funcionarioId = document.getElementById("funcionarioVacinado").value;
            const data = document.getElementById("dataAgendamento").value;
            const tipo = document.getElementById("tipoVacina").value;
            const dataAgendamento = new Date(data);
            const dataAtual = new Date();

            if (dataAgendamento <= dataAtual) {
                alert("A data do agendamento deve ser futura.");
                return;
            }

            const dadosAgendamento = { funcionarioId, data, tipo };
            enviarParaAPI("https://api.exemplo.com/agendamentos", dadosAgendamento, () => {
                formAgendarVacina.reset();
            });
        });
    }

    const formVacinar = document.getElementById("formVacinar");
    if (formVacinar) {
        formVacinar.addEventListener("submit", function (event) {
            event.preventDefault();
            const funcionarioId = document.getElementById("funcionarioVacinado").value;
            const data = document.getElementById("dataVacina").value;
            const tipo = document.getElementById("tipoVacinaAplicada").value;

            const dadosVacinacao = { funcionarioId, data, tipo };
            enviarParaAPI("https://api.exemplo.com/vacinacoes", dadosVacinacao, () => {
                formVacinar.reset();
            });
        });
    }

    function validarCPF(cpf) {
        return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf);
    }

    function validarTelefone(telefone) {
        return /\(\d{2}\)\s\d{5}-\d{4}/.test(telefone);
    }

    function validarEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }
});
