const importarCsvButton = document.getElementById("importar-csv");
const exportarCsvButton = document.getElementById("exportar-csv");
const exportarTodosMacButton = document.getElementById("exportar-todosMAC");
const exportarCsvPendenteButton = document.getElementById("exportar-pendente");
const exportarConsultasButton = document.getElementById("exportar-consultas");
const exportarExamesButton = document.getElementById("exportar-exames");
const exportarCirurgiasButton = document.getElementById("exportar-cirurgias");
const exportarMacButton = document.getElementById("exportar-apacsMac");
const exportarFaecButton = document.getElementById("exportar-apacsFaec");
const exportarGlaucomaButton = document.getElementById("exportar-apacsGlaucoma");
const exportarMamografiaButton = document.getElementById("exportar-mamografia");
const exportarTomografiaButton = document.getElementById("exportar-tomografia");


const dadosCsvTable = document.getElementById("dados-csv");
const colunasParaRemover = [
  1, 4, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37
];

function replaceDotWithComma(rows) {
  return rows.map(row => {
    const cols = row.split(";");
    if (cols[6]) {
      cols[6] = cols[6].replace(/\./g, ",");
    }

    if (cols[1] === "0405030177" && cols[6] === "0,00") {
      cols[6] = "4701,84";
    } else if (cols[1] === "0405030169" && cols[6] === "0,00") {
      cols[6] = "4183,12";
    }

    return cols.join(";");
  });
}


importarCsvButton.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv";
  fileInput.click();
  fileInput.addEventListener("change", () => {
    const reader = new FileReader();
    reader.readAsText(fileInput.files[0]);
    reader.addEventListener("load", () => {
      const csvData = reader.result;
      const linhas = csvData.split("\n");
      const cabecalho = linhas[0].split(";");
      const novoCabecalho = cabecalho.filter((_, i) => !colunasParaRemover.includes(i));
      const novasLinhas = linhas.slice(1).map(linha => {
        const celulas = linha.split(";");
        return celulas.filter((_, i) => !colunasParaRemover.includes(i)).join(";");
      });

      // Replace '.' with ',' in column 7 (6th index in the filtered data)
      const linhasComVirgula = replaceDotWithComma(novasLinhas);

      const novoCsv = [novoCabecalho.join(";"), ...linhasComVirgula].join("\n");

      // Exibir na tela
      dadosCsvTable.style.display = "block";
      exportarCsvButton.style.display = "inline-block";
	  exportarTodosMacButton.style.display = "inline-block";
	  exportarCsvPendenteButton.style.display = "inline-block";
      exportarConsultasButton.style.display = "inline-block";
      exportarExamesButton.style.display = "inline-block";
      exportarCirurgiasButton.style.display = "inline-block";
      exportarMacButton.style.display = "inline-block";
      exportarFaecButton.style.display = "inline-block";
      exportarGlaucomaButton.style.display = "inline-block";
      exportarMamografiaButton.style.display = "inline-block";
      exportarTomografiaButton.style.display = "inline-block";

      let html = "<thead><tr>";
      novoCabecalho.forEach(coluna => {
        html += `<th>${coluna}</th>`;
      });
      html += "</tr></thead><tbody>";
      linhasComVirgula.forEach(linha => {
        html += "<tr>";
        const celulas = linha.split(";");
        celulas.forEach(celula => {
          html += `<td>${celula}</td>`;
        });
        html += "</tr>";
      });
      html += "</tbody>";
      dadosCsvTable.innerHTML = html;

      // Ordenar ao clicar no cabeçalho
      const ths = dadosCsvTable.getElementsByTagName("th");
      Array.from(ths).forEach(th => {
        th.addEventListener("click", () => {
          const index = Array.from(ths).indexOf(th);
          const tipo = th.getAttribute("data-tipo") || "asc";
          const novaOrdem = tipo === "asc" ? "desc" : "asc";
          th.setAttribute("data-tipo", novaOrdem);
          const tbody = dadosCsvTable.getElementsByTagName("tbody")[0];
          const linhas = Array.from(tbody.getElementsByTagName("tr")).sort((a, b) => {
            const celulaA = a.getElementsByTagName("td")[index]?.textContent;
            const celulaB = b.getElementsByTagName("td")[index]?.textContent;

            if (celulaA && celulaB) {
              if (celulaA < celulaB) {
                return tipo === "asc" ? -1 : 1;
              } else if (celulaA > celulaB) {
                return tipo === "asc" ? 1 : -1;
              }
            }
            return 0;
          });
          tbody.innerHTML = "";
          linhas.forEach(linha => tbody.appendChild(linha));
        });
      });

      exportarCsvButton.addEventListener("click", () => {
        const rows = document.querySelectorAll("table tr");
        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(row => {
          const cols = row.querySelectorAll("td");
          const colValues = [];
          cols.forEach(col => {
            colValues.push(col.innerText);
          });
          if (colValues[7] === "CONFIRMADO") {
            csvContent += colValues.join(";") + "\r\n";
          }
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "total.xls");
        document.body.appendChild(link);
        link.click();
      });
	  
	  exportarTodosMacButton.addEventListener("click", () => {
        const rows = document.querySelectorAll("table tr");
        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(row => {
          const cols = row.querySelectorAll("td");
          const colValues = [];
          cols.forEach(col => {
            colValues.push(col.innerText);
          });
          if (colValues[7] === "CONFIRMADO" && colValues[1] !== "0211060283" && colValues[1] !== "0303050233") {
            csvContent += colValues.join(";") + "\r\n";
          }
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "total.xls");
        document.body.appendChild(link);
        link.click();
      });
	  
	  exportarCsvPendenteButton.addEventListener("click", () => {
        const rows = document.querySelectorAll("table tr");
        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(row => {
          const cols = row.querySelectorAll("td");
          const colValues = [];
          cols.forEach(col => {
            colValues.push(col.innerText);
          });
          if (colValues[7] === "PENDENTE") {
            csvContent += colValues.join(";") + "\r\n";
          }
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "total.xls");
        document.body.appendChild(link);
        link.click();
      });
            

			exportarConsultasButton.addEventListener("click", () => {
				const rows = document.querySelectorAll("table tr");
				let csvContent = "data:text/csv;charset=utf-8,";
            
				rows.forEach(row => {
				const cols = row.querySelectorAll("td");
				const colValues = [];
				cols.forEach(col => {
				colValues.push(col.innerText);
				});
				if (colValues[7] === "CONFIRMADO" && colValues[1] === "0301010072"){
				csvContent += colValues.join(";") + "\r\n";
				}
				});
            
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "consultas.xls");
				document.body.appendChild(link);
				link.click();
			});

			exportarExamesButton.addEventListener("click", () => {
				const rows = document.querySelectorAll("table tr");
				let csvContent = "data:text/csv;charset=utf-8,";
            
				rows.forEach(row => {
				const cols = row.querySelectorAll("td");
				const colValues = [];
				cols.forEach(col => {
				colValues.push(col.innerText);
				});
				if (colValues[7] === "CONFIRMADO" && (colValues[1] === "0211060011" || colValues[1] === "0211060020"
				 || colValues[1] === "0211060038" || colValues[1] === "0211060054" || colValues[1] === "0211060100"
				 || colValues[1] === "0405050178" || colValues[1] === "0211060127" || colValues[1] === "0211060143"
				 || colValues[1] === "0205020020" || colValues[1] === "0211060178" || colValues[1] === "0211060186"
				 || colValues[1] === "0211060224" || colValues[1] === "0211060259" || colValues[1] === "0211060267"
				 || colValues[1] === "0405050364" || colValues[1] === "0205020089" || colValues[1] === "0405030223"
				 || colValues[1] === "0405030215" || colValues[1] === "0211060232" || colValues[1] === "0211060151"
				 || colValues[1] === "0405030096" || colValues[1] === "0405050305" || colValues[1] === "0211060062"
				)) {
				csvContent += colValues.join(";") + "\r\n";
				}
				});
            
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "exames.xls");
				document.body.appendChild(link);
				link.click();
			});
			
			exportarCirurgiasButton.addEventListener("click", () => {
  const rows = document.querySelectorAll("table tr");
  let csvContent = "data:text/csv;charset=utf-8,";
  const exportedCodes = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    const colValues = [];
    cols.forEach(col => {
      colValues.push(col.innerText);
    });
    if (
      colValues[7] === "CONFIRMADO" && (colValues[1] === "0405050372" || colValues[1] === "0405030070" ||
      colValues[1] === "0405030142" || colValues[1] === "0405030134" || colValues[1] === "0405030177" ||
      colValues[1] === "0405030169" || colValues[1] === "0405010133" || colValues[1] === "0405050151" || 
	  colValues[1] === "0405050321" || colValues[1] === "8146063" || colValues[1] === "0505010097" || colValues[1] === "0405040105")) {
      csvContent += colValues.join(";") + "\r\n";
    }
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "cirurgias.xls");
  document.body.appendChild(link);
  link.click();
});

exportarMacButton.addEventListener("click", () => {
  const rows = document.querySelectorAll("table tr");
  let csvContent = "data:text/csv;charset=utf-8,";
  const exportedCodes = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    const colValues = [];
    cols.forEach(col => {
      colValues.push(col.innerText);
    });
    if (
      colValues[7] === "CONFIRMADO" && (colValues[1] === "0405050020" || colValues[1] === "0405030045" ||
      colValues[1] === "0405030193" || colValues[1] === "0405050216" || colValues[1] === "0405010079")) {
      csvContent += colValues.join(";") + "\r\n";
    }
    });

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "ApacsMac.xls");
	document.body.appendChild(link);
	link.click();
});

			
			exportarFaecButton.addEventListener("click", () => {
				const rows = document.querySelectorAll("table tr");
				let csvContent = "data:text/csv;charset=utf-8,";
            
				rows.forEach(row => {
				const cols = row.querySelectorAll("td");
				const colValues = [];
				cols.forEach(col => {
				colValues.push(col.innerText);
				});
				if (colValues[7] === "CONFIRMADO" && (colValues[1] === "0211060283" || colValues[1] === "0303050233")) {
				csvContent += colValues.join(";") + "\r\n";
				}
				});
            
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "ApacsFaec.xls");
				document.body.appendChild(link);
				link.click();
			});
			
			exportarGlaucomaButton.addEventListener("click", () => {
				const rows = document.querySelectorAll("table tr");
				let csvContent = "data:text/csv;charset=utf-8,";
            
				rows.forEach(row => {
				const cols = row.querySelectorAll("td");
				const colValues = [];
				cols.forEach(col => {
				colValues.push(col.innerText);
				});
				if (colValues[7] === "CONFIRMADO" && (colValues[1] === "0301010102" || colValues[1] === "0303050012"
				 || colValues[1] === "0303050039" || colValues[1] === "0303050047" || colValues[1] === "0303050055"
				 || colValues[1] === "0303050063" || colValues[1] === "0303050071" || colValues[1] === "0303050080"
				 || colValues[1] === "0303050098" || colValues[1] === "0303050101" || colValues[1] === "0303050110"
				 || colValues[1] === "0303050152" || colValues[1] === "0303050160" || colValues[1] === "0303050179"
				 || colValues[1] === "0303050187" || colValues[1] === "0303050195" || colValues[1] === "0303050209"
				 || colValues[1] === "0303050217" || colValues[1] === "0303050225"
				)) {
				csvContent += colValues.join(";") + "\r\n";
				}
				});
            
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "Glaucoma.xls");
				document.body.appendChild(link);
				link.click();
			});
			
			exportarMamografiaButton.addEventListener("click", () => {
				const rows = document.querySelectorAll("table tr");
				let csvContent = "data:text/csv;charset=utf-8,";
            
				rows.forEach(row => {
				const cols = row.querySelectorAll("td");
				const colValues = [];
				cols.forEach(col => {
				colValues.push(col.innerText);
				});
				if (colValues[7] === "CONFIRMADO" && (colValues[1] === "0204030188" || colValues[1] === "0204030030"
				)) {
				csvContent += colValues.join(";") + "\r\n";
				}
				});
            
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "Mamografia.xls");
				document.body.appendChild(link);
				link.click();
			});
			
			exportarTomografiaButton.addEventListener("click", () => {
				const rows = document.querySelectorAll("table tr");
				let csvContent = "data:text/csv;charset=utf-8,";
            
				rows.forEach(row => {
				const cols = row.querySelectorAll("td");
				const colValues = [];
				cols.forEach(col => {
				colValues.push(col.innerText);
				});
				if (colValues[7] === "CONFIRMADO" && !(colValues[1] === "0204030188" || colValues[1] === "0204030030"
				)) {
				csvContent += colValues.join(";") + "\r\n";
				}
				});
            
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "Tomografia.xls");
				document.body.appendChild(link);
				link.click();
			});

        });
    });
	
});

/*document.addEventListener("DOMContentLoaded", function () {
  // ...

  // Função para criar um PDF de consultas confirmadas
  function criarPDFConsultasConfirmadas() {
    console.log("Iniciando a criação do PDF de consultas confirmadas");

    // Obter todas as linhas da tabela
    const rows = document.querySelectorAll("table tbody tr");

    // Inicializar variáveis para contagem
    let totalConsultas = 0;
    const cidades = {};

    // Iterar pelas linhas da tabela
    rows.forEach((row) => {
      const cols = row.querySelectorAll("td");

      // Verificar se há pelo menos 8 colunas
      if (cols.length >= 8) {
        // Verificar se a consulta está confirmada (coluna 7) e o código unificado (coluna 1)
        const codigoUnificado = cols[1].textContent.trim();
        const status = cols[7].textContent.trim();

        if (codigoUnificado === "0301010072" && status === "CONFIRMADO") {
          totalConsultas++;

          // Obter a cidade (coluna 5) e o valor (coluna 6)
          const cidade = cols[5].textContent.trim();
          const valor = parseFloat(cols[6].textContent.trim().replace(",", "."));

          // Adicionar à contagem de consultas por cidade
          if (cidade in cidades) {
            cidades[cidade].consultas++;
            cidades[cidade].valor += valor;
          } else {
            cidades[cidade] = { consultas: 1, valor: valor };
          }
        }
      }
    });

    // Gerar texto com os dados da contagem por cidade
    let textoCidades = "Consultas por cidade:\n\n";
    for (const cidade in cidades) {
      textoCidades += `${cidade}: ${cidades[cidade].consultas} consultas, Valor Total: R$ ${cidades[cidade].valor.toFixed(
        2
      )}\n`;
    }

    // Criar um arquivo de texto para download
    const blob = new Blob([textoCidades], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "relatorio_consultas.txt";
    link.click();
    console.log("Arquivo de consultas confirmadas gerado com sucesso");
  }

  // Lidar com o clique no botão "Gerar PDF de Consultas Confirmadas"
  document
    .getElementById("gerar-pdf-consultas")
    .addEventListener("click", criarPDFConsultasConfirmadas);
});

*/

document.addEventListener("DOMContentLoaded", async function () {
  const { PDFDocument, rgb, StandardFonts } = PDFLib;

  // Função para criar um PDF de consultas confirmadas
  async function criarPDFConsultasConfirmadas() {
    console.log("Iniciando a criação do PDF de consultas confirmadas");

    // Criar um novo documento PDF com tamanho de página A4 (210 x 297 mm)
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // Tamanho A4 em pontos (1 mm = 2.83 pontos)

    // Definir margens laterais de 20 mm (72 pontos por polegada)
    const marginLeft = 72 / 2.83;
    const marginRight = 72 / 2.83;

    // Definir cabeçalho e rodapé de 20 mm
    const headerHeight = 72 / 2.83;
    const footerHeight = 72 / 2.83;

    // Definir largura das colunas da tabela
    const columnWidth = (page.getWidth() - marginLeft - marginRight) / 3;

    // Resto do código permanece o mesmo até a parte de contagem por cidade
    const rows = document.querySelectorAll("table tbody tr");
    let totalConsultas = 0;
    let totalValor = 0;
    let cidades = {};

    // Iterar pelas linhas da tabela
    rows.forEach((row) => {
      const cols = row.querySelectorAll("td");

      if (cols.length >= 8) {
        const codigoUnificado = cols[1].textContent.trim();
        const status = cols[7].textContent.trim();

        if (codigoUnificado === "0301010072" && status === "CONFIRMADO") {
          totalConsultas++;

          const cidade = cols[5].textContent.trim();
          const valor = parseFloat(cols[6].textContent.trim().replace(",", "."));

          totalValor += valor;

          if (cidade in cidades) {
            cidades[cidade].consultas++;
            cidades[cidade].valor += valor;
          } else {
            cidades[cidade] = { consultas: 1, valor: valor };
          }
        }
      }
    });

    // Definir a fonte e tamanho do texto após a contagem
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 16;

    // Adicionar cabeçalho da tabela
    const headerText = "CIDADE                         QUANTIDADE                             VALOR";
    const headerX = marginLeft;
    const headerY = page.getHeight() - headerHeight - 20; // Espaço para o cabeçalho

    page.drawText(headerText, {
      x: headerX,
      y: headerY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
      bold: true,
    });

    // Adicionar linhas da tabela
    let currentY = headerY - 20; // Iniciar abaixo do cabeçalho

    for (const cidade in cidades) {
      const quantidadeText = cidades[cidade].consultas.toString().padStart(30);
      const valorText = `R$ ${cidades[cidade].valor.toFixed(2)}`.padStart(30);
      const cidadeText = cidade.padEnd(30) +
        quantidadeText +
        valorText;
      currentY -= 20; // Espaço entre as linhas

      // Adicionar bordas à tabela (linhas horizontais)
      page.drawLine({
        start: { x: marginLeft, y: currentY + 20 },
        end: { x: page.getWidth() - marginRight, y: currentY + 20 },
        color: rgb(0, 0, 0),
        thickness: 1,
      });

      if (currentY < footerHeight) {
        // ... (resto do código para nova página, se necessário)
      }

      // Dividir os dados em três colunas igualmente espaçadas
      const columns = cidadeText.split(/\s{2,}/);
      const columnWidth = (page.getWidth() - marginLeft - marginRight) / 3;
      page.drawText(columns[0], {
        x: marginLeft + 10,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        alignment: 'right', // Alinhar à direita
      });
      page.drawText(columns[1], {
        x: marginLeft + columnWidth + 10,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        alignment: 'right', // Alinhar à direita
      });
      page.drawText(columns[2], {
        x: marginLeft + columnWidth * 2 + 10,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    // Adicionar o total geral
    currentY -= 40; // Mova um pouco mais para baixo e adicione espaço entre o total geral e os outros dados
    const totalGeralText = `Total Geral:`.padEnd(30) +
      `${totalConsultas}`.padStart(30) +
      `R$ ${totalValor.toFixed(2)}`.padStart(30);
    const totalGeralX = marginLeft; // Mantenha a mesma indentação
    page.drawText(totalGeralText, {
      x: totalGeralX,
      y: currentY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
      bold: true,
    });

    // Salvar o PDF
    const pdfBytes = await pdfDoc.save();

    // Criar um arquivo PDF para download
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "relatorio_consultas.pdf";
    link.click();
    console.log("PDF de consultas confirmadas gerado com sucesso");
  }

  // Lidar com o clique no botão "Gerar PDF de Consultas Confirmadas"
  document
    .getElementById("gerar-pdf-consultas")
    .addEventListener("click", criarPDFConsultasConfirmadas);
});










