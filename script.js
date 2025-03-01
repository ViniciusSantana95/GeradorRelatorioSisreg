document.addEventListener("DOMContentLoaded", () => {
    // Elementos HTML dos filtros
    const fileInput = document.getElementById("fileInput");
    const complexidadeSelect = document.getElementById("complexidade");
    const financiamentoSelect = document.getElementById("financiamento");
    const instrumentoSelect = document.getElementById("instrumentoRegistro");
    const situacaoSelect = document.getElementById("situacao");
    const grupoSelect = document.getElementById("grupo");
    const subgrupoSelect = document.getElementById("subgrupo");
    const formaSelect = document.getElementById("formaOrganizacao");
  
    // Variáveis para armazenar dados dos arquivos TXT
    let tbProcedimentos = {};      // De tb_procedimento.txt: { código: { complexidade, financiamento } }
    let tbFinanciamento = {};      // De tb_financiamento.txt: { codigoFinanciamento: descricao }
    let tbRegistro = {};           // De tb_registro.txt: { codigoRegistro: descricao }
    let rlProcedimentoRegistro = {}; // De rl_procedimento_registro.txt: { códigoProcedimento: [ codigoRegistro, ... ] }
    let tbGrupo = {};              // De tb_grupo.txt: { codigoGrupo: descricao }
    let tbSubGrupo = {};           // De tb_sub_grupo.txt: { codigoGrupo: [ { subgrupo, descricao }, ... ] }
    let tbForma = {};              // De tb_forma_organizacao.txt: { codigoGrupo: { codigoSubGrupo: [ { forma, descricao }, ... ] } }
  
    // --- Carregar tb_procedimento.txt ---
    fetch("http://127.0.0.1:5500/tabelaSUS/tb_procedimento.txt")
      .then(response => response.text())
      .then(data => {
        console.log("Arquivo tb_procedimento.txt carregado.");
        const linhas = data.split("\n");
        linhas.forEach(linha => {
          if (linha.length >= 314) {
            const codigo = linha.substring(0, 10).trim();
            const complexidade = linha.charAt(260);
            const financiamento = linha.substring(312, 314).trim();
            tbProcedimentos[codigo] = { complexidade, financiamento };
          }
        });
      })
      .catch(error => console.error("Erro ao carregar tb_procedimento.txt:", error));
  
    // --- Carregar tb_financiamento.txt ---
    fetch("http://127.0.0.1:5500/tabelaSUS/tb_financiamento.txt")
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder("iso-8859-1");
        const data = decoder.decode(buffer);
        console.log("Arquivo tb_financiamento.txt carregado.");
        const linhas = data.split("\n");
        linhas.forEach(linha => {
          if (linha.length >= 3) {
            const codigoFinanciamento = linha.substring(0, 2).trim();
            const descricao = linha.substring(2, 102).trim();
            tbFinanciamento[codigoFinanciamento] = descricao;
          }
        });
        for (const codigo in tbFinanciamento) {
          const option = document.createElement("option");
          option.value = codigo;
          option.textContent = `${codigo} - ${tbFinanciamento[codigo]}`;
          financiamentoSelect.appendChild(option);
        }
      })
      .catch(error => console.error("Erro ao carregar tb_financiamento.txt:", error));
  
    // --- Carregar tb_registro.txt (Instrumento de Registro) ---
    fetch("http://127.0.0.1:5500/tabelaSUS/tb_registro.txt")
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder("iso-8859-1");
        const data = decoder.decode(buffer);
        console.log("Arquivo tb_registro.txt carregado.");
        const linhas = data.split("\n");
        linhas.forEach(linha => {
          if (linha.length >= 3) {
            const codigoRegistro = linha.substring(0, 2).trim();
            const descricaoRegistro = linha.substring(2, 52).trim();
            tbRegistro[codigoRegistro] = descricaoRegistro;
          }
        });
        for (const codigo in tbRegistro) {
          const option = document.createElement("option");
          option.value = codigo;
          option.textContent = `${codigo} - ${tbRegistro[codigo]}`;
          instrumentoSelect.appendChild(option);
        }
      })
      .catch(error => console.error("Erro ao carregar tb_registro.txt:", error));
  
    // --- Carregar rl_procedimento_registro.txt ---
    fetch("http://127.0.0.1:5500/tabelaSUS/rl_procedimento_registro.txt")
      .then(response => response.text())
      .then(data => {
        console.log("Arquivo rl_procedimento_registro.txt carregado.");
        const linhas = data.split("\n");
        linhas.forEach(linha => {
          if (linha.length >= 12) {
            const codigoProcedimento = linha.substring(0, 10).trim();
            const codigoRegistro = linha.substring(10, 12).trim();
            if (!rlProcedimentoRegistro[codigoProcedimento]) {
              rlProcedimentoRegistro[codigoProcedimento] = [];
            }
            rlProcedimentoRegistro[codigoProcedimento].push(codigoRegistro);
          }
        });
      })
      .catch(error => console.error("Erro ao carregar rl_procedimento_registro.txt:", error));
  
    // --- Carregar tb_grupo.txt ---
    fetch("http://127.0.0.1:5500/tabelaSUS/tb_grupo.txt")
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder("iso-8859-1");
        const data = decoder.decode(buffer);
        console.log("Arquivo tb_grupo.txt carregado.");
        const linhas = data.split("\n");
        linhas.forEach(linha => {
          if (linha.length >= 101) {
            const codigoGrupo = linha.substring(0, 2).trim();
            const descricaoGrupo = linha.substring(2, 102).trim();
            tbGrupo[codigoGrupo] = descricaoGrupo;
          }
        });
        for (const codigo in tbGrupo) {
          const option = document.createElement("option");
          option.value = codigo;
          option.textContent = `${codigo} - ${tbGrupo[codigo]}`;
          grupoSelect.appendChild(option);
        }
      })
      .catch(error => console.error("Erro ao carregar tb_grupo.txt:", error));
  
    // --- Carregar tb_sub_grupo.txt ---
    fetch("http://127.0.0.1:5500/tabelaSUS/tb_sub_grupo.txt")
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder("iso-8859-1");
        const data = decoder.decode(buffer);
        console.log("Arquivo tb_sub_grupo.txt carregado.");
        const linhas = data.split("\n");
        tbSubGrupo = {};
        linhas.forEach(linha => {
          if (linha.length >= 103) {
            const codigoGrupo = linha.substring(0, 2).trim();
            const codigoSubGrupo = linha.substring(2, 4).trim();
            const descricaoSubGrupo = linha.substring(4, 104).trim();
            if (!tbSubGrupo[codigoGrupo]) {
              tbSubGrupo[codigoGrupo] = [];
            }
            tbSubGrupo[codigoGrupo].push({ subgrupo: codigoSubGrupo, descricao: descricaoSubGrupo });
          }
        });
        subgrupoSelect.disabled = true;
      })
      .catch(error => console.error("Erro ao carregar tb_sub_grupo.txt:", error));
  
    // --- Carregar tb_forma_organizacao.txt ---
    fetch("http://127.0.0.1:5500/tabelaSUS/tb_forma_organizacao.txt")
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder("iso-8859-1");
        const data = decoder.decode(buffer);
        console.log("Arquivo tb_forma_organizacao.txt carregado.");
        const linhas = data.split("\n");
        tbForma = {};
        linhas.forEach(linha => {
          if (linha.length >= 105) {
            const codigoGrupo = linha.substring(0, 2).trim();
            const codigoSubGrupo = linha.substring(2, 4).trim();
            const codigoForma = linha.substring(4, 6).trim();
            const descricaoForma = linha.substring(6, 106).trim();
            if (!tbForma[codigoGrupo]) {
              tbForma[codigoGrupo] = {};
            }
            if (!tbForma[codigoGrupo][codigoSubGrupo]) {
              tbForma[codigoGrupo][codigoSubGrupo] = [];
            }
            tbForma[codigoGrupo][codigoSubGrupo].push({ forma: codigoForma, descricao: descricaoForma });
          }
        });
        formaSelect.disabled = true;
      })
      .catch(error => console.error("Erro ao carregar tb_forma_organizacao.txt:", error));
  
    // --- Eventos de cascata para Grupo, Subgrupo e Forma de Organização ---
    grupoSelect.addEventListener("change", () => {
      const grupoSelecionado = grupoSelect.value;
      subgrupoSelect.innerHTML = '<option value="">Selecione</option>';
      formaSelect.innerHTML = '<option value="">Selecione</option>';
      formaSelect.disabled = true;
      if (grupoSelecionado && tbSubGrupo[grupoSelecionado]) {
        tbSubGrupo[grupoSelecionado].forEach(item => {
          const option = document.createElement("option");
          option.value = item.subgrupo;
          option.textContent = `${item.subgrupo} - ${item.descricao}`;
          subgrupoSelect.appendChild(option);
        });
        subgrupoSelect.disabled = false;
      } else {
        subgrupoSelect.disabled = true;
      }
    });
  
    subgrupoSelect.addEventListener("change", () => {
      const grupoSelecionado = grupoSelect.value;
      const subgrupoSelecionado = subgrupoSelect.value;
      formaSelect.innerHTML = '<option value="">Selecione</option>';
      if (grupoSelecionado && subgrupoSelecionado && tbForma[grupoSelecionado] && tbForma[grupoSelecionado][subgrupoSelecionado]) {
        tbForma[grupoSelecionado][subgrupoSelecionado].forEach(item => {
          const option = document.createElement("option");
          option.value = item.forma;
          option.textContent = `${item.forma} - ${item.descricao}`;
          formaSelect.appendChild(option);
        });
        formaSelect.disabled = false;
      } else {
        formaSelect.disabled = true;
      }
    });
  
    // --- Preencher opções do filtro de Complexidade (mantendo a estrutura original) ---
    const complexidadeOpcoes2 = [
      { valor: "0", texto: "0 - Não se aplica" },
      { valor: "1", texto: "1 - Atenção Básica" },
      { valor: "2", texto: "2 - Média Complexidade" },
      { valor: "3", texto: "3 - Alta Complexidade" }
    ];
    complexidadeOpcoes2.forEach(opcao => {
      const option = document.createElement("option");
      option.value = opcao.valor;
      option.textContent = opcao.texto;
      complexidadeSelect.appendChild(option);
    });
  
    // --- Função processFile: aplica os filtros e exporta o CSV ---
    window.processFile = function () {
        const file = fileInput.files[0];
        if (!file) {
            alert("Por favor, selecione um arquivo CSV.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const linhas = e.target.result.split("\n");
            console.log("Arquivo CSV carregado, total de linhas:", linhas.length);
    
            // Lista de índices a serem removidos (conforme sua lógica original)
            const colunasRemover = [1, 4, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37];
    
            // Obter os filtros selecionados
            const complexidadeSelecionada = Array.from(complexidadeSelect.selectedOptions).map(opt => opt.value);
            const financiamentoSelecionado = Array.from(financiamentoSelect.selectedOptions).map(opt => opt.value);
            const instrumentoSelecionado = Array.from(instrumentoSelect.selectedOptions).map(opt => opt.value);
            const situacaoSelecionada = Array.from(situacaoSelect.selectedOptions).map(opt => opt.value);
            const grupoSelecionado = grupoSelect.value.trim();
            const subgrupoSelecionado = subgrupoSelect.value.trim();
            const formaSelecionada = formaSelect.value.trim();
    
            console.log("Filtros selecionados - Complexidade:", complexidadeSelecionada);
            console.log("Filtros selecionados - Financiamento:", financiamentoSelecionado);
            console.log("Filtros selecionados - Instrumento de Registro:", instrumentoSelecionado);
            console.log("Filtros selecionados - Situação:", situacaoSelecionada);
            console.log("Filtros selecionados - Grupo:", grupoSelecionado);
            console.log("Filtros selecionados - Subgrupo:", subgrupoSelecionado);
            console.log("Filtros selecionados - Forma de Organização:", formaSelecionada);
    
            const resultado = [];
            linhas.forEach(linha => {
                let colunas = linha.split(";");
                if (colunas.length > 1) {
                    colunas = colunas.filter((_, i) => !colunasRemover.includes(i) && i < colunas.length);
    
                    // Substituir ponto por vírgula na coluna de índice 6
                    if (colunas.length > 6) {
                        colunas[6] = colunas[6].replace(/\./g, ",");
                    }
    
                    // Obter os dados do CSV
                    const codigoProcedimento = colunas[1]?.trim();
                    const situacao = colunas[7]?.trim();
                    const grupoLinha = colunas[8]?.trim();
                    const subgrupoLinha = colunas[9]?.trim();
                    const formaLinha = colunas[10]?.trim();
    
                    // Dados do tb_procedimentos (complexidade e financiamento)
                    const dadosProcedimento = tbProcedimentos[codigoProcedimento] || { complexidade: "N/A", financiamento: "N/A" };
                    // Registros associados (instrumento de registro) do rl_procedimento_registro.txt
                    const registrosAssociados = rlProcedimentoRegistro[codigoProcedimento] || [];
    
                    // Verificações dos filtros existentes
                    const complexidadeOk = complexidadeSelecionada.length === 0 || complexidadeSelecionada.includes(dadosProcedimento.complexidade);
                    const financiamentoOk = financiamentoSelecionado.length === 0 || financiamentoSelecionado.includes(dadosProcedimento.financiamento);
                    const instrumentoOk = instrumentoSelecionado.length === 0 || instrumentoSelecionado.some(r => registrosAssociados.includes(r));
                    const situacaoOk = situacaoSelecionada.length === 0 || situacaoSelecionada.includes(situacao);
    
                    // Verificações para Grupo, Subgrupo e Forma de Organização
                    let grupoOk = true;
                    let subgrupoOk = true;
                    let formaOk = true;
    
                    if (grupoSelecionado) {
                        grupoOk = codigoProcedimento.startsWith(grupoSelecionado);
                    }
                    if (grupoSelecionado && subgrupoSelecionado) {
                        const codigoGrupoSubgrupo = grupoSelecionado + subgrupoSelecionado;
                        subgrupoOk = codigoProcedimento.startsWith(codigoGrupoSubgrupo);
                    }
                    if (grupoSelecionado && subgrupoSelecionado && formaSelecionada) {
                        const codigoGrupoSubgrupoForma = grupoSelecionado + subgrupoSelecionado + formaSelecionada;
                        formaOk = codigoProcedimento.startsWith(codigoGrupoSubgrupoForma);
                    }
    
                    if (complexidadeOk && financiamentoOk && instrumentoOk && situacaoOk && grupoOk && subgrupoOk && formaOk) {
                        resultado.push(colunas);
                    }
                }
            });
    
            // Ordenar os resultados antes da exportação:
            // Primeiro, ordena pela coluna de índice 2, depois pela coluna de índice 4, e por último pela coluna de índice 5.
            if (resultado.length === 0) {
                console.warn("Nenhum dado encontrado após filtragem. Exportação cancelada.");
                alert("Nenhum dado encontrado para exportação.");
              } else {
                // Ordenar os resultados conforme solicitado:
                resultado.sort((a, b) => {
                  let cmp = (a[5] || "").trim().localeCompare((b[5] || "").trim());
                  if (cmp !== 0) return cmp;
                  cmp = (a[4] || "").trim().localeCompare((b[4] || "").trim());
                  if (cmp !== 0) return cmp;
                  return (a[2] || "").trim().localeCompare((b[2] || "").trim());
                });
                exportToExcel(resultado);
              }


        };
        reader.readAsText(file);
    };
    
    function exportToExcel(data) {
        if (data.length === 0) {
            alert("Nenhum dado para exportar.");
            return;
        }
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados Filtrados");
        XLSX.writeFile(wb, "dados_filtrados.xlsx");
    }
    
  });
  