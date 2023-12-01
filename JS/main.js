// Função para recortar a imagem em 9 partes iguais
function recortarImagem(imagem) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
     larguraDaImagem = imagem.width;
     alturaDaImagem = imagem.height;
     canvas.width = larguraDaImagem / 3;
     canvas.height = alturaDaImagem / 3;
  
    var partes = [];
    
    for (var i = 0; i < 3; i++) {
      let posicaoImagem = i;
      for (var j = 0; j < 3; j++) {
        ctx.drawImage(imagem, i * canvas.width, j * canvas.height, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        let urlImage = (i == 2 && j == 2) ? "" : canvas.toDataURL() ;
        partes.push({ 'posicaoImagem':posicaoImagem, src:  urlImage });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        posicaoImagem += 3;
      }
      
    }
  
    return partes;
  }
  
  // Função para embaralhar a ordem das partes
  function embaralharPartes(partes) {
    var partesEmbaralhadas = partes.slice(); // Faz uma cópia das partes
  
    for (var i = partesEmbaralhadas.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = partesEmbaralhadas[i];
      partesEmbaralhadas[i] = partesEmbaralhadas[j];
      partesEmbaralhadas[j] = temp;
    }
  
    return partesEmbaralhadas;
  }
  
  // Função para adicionar as partes recortadas em uma matriz de forma aleatória e exibi-las na tabela HTML
  function adicionarPartesNaMatriz(partes) {
    var tabela = document.getElementById('tabela');
  
    var matriz = [];
    var index = 0;
  
    for (var i = 0; i < 3; i++) {
      var linha = document.createElement('tr'); 
      for (var j = 0; j < 3; j++) {
        var celula = document.createElement('td');  
        celula.setAttribute('posicaoDaCelulaNaTabela', index);
        var img = document.createElement('img');
       
        img.src = partes[index].src;
        img.className = 'parte-imagem';
        img.setAttribute('linha', i);
        img.setAttribute('coluna', j);  
        img.setAttribute('posicaoDaCelulaDaImagemNaTabela', partes[index].posicaoImagem);
        img.addEventListener('click', function() {
          var currentImg = $(this);

          var tabela = document.getElementById("tabela");

          // Supondo que você queira a célula da terceira linha e segunda coluna
          var linha = $(this).attr('linha');  
          var coluna = $(this).attr('coluna'); 

          // linha 
           
          var celula = tabela.rows[linha].cells[coluna];
          let celulaEsquerda = tabela.rows[linha].cells[parseInt(coluna) -1 ] != undefined ? tabela.rows[linha].cells[parseInt(coluna) -1 ] : null;
          let celulaDireita =  tabela.rows[linha].cells[parseInt(coluna) + 1 ] != undefined ? tabela.rows[linha].cells[parseInt(coluna) + 1]: null;
          let celulaAcima = tabela.rows[parseInt(linha) - 1] != undefined ? tabela.rows[parseInt(linha) - 1].cells[coluna] : null;
          let celulaAbaixo = tabela.rows[parseInt(linha) + 1] != undefined ? tabela.rows[parseInt(linha) + 1].cells[coluna] : null;

            
          
          if(celulaEsquerda != null){
            var xxx = celulaEsquerda.children[0];
            if(xxx.attributes['src'].value == ""){
 
               let imagemClicada = celula.children[0];
               let imagemDataBase = imagemClicada.attributes['src'].value;
               let imagemFilha = imagemClicada.attributes.posicaodaceluladaimagemnatabela.value;
               let imagemPai = xxx.attributes.posicaodaceluladaimagemnatabela.value;

               xxx.attributes['src'].value = imagemDataBase;
               xxx.attributes.posicaodaceluladaimagemnatabela.value = imagemFilha;

               imagemClicada.attributes['src'].value = "";
               imagemClicada.attributes.posicaodaceluladaimagemnatabela.value = imagemPai;
            }
          }

          if(celulaDireita != null){
            var xxx = celulaDireita.children[0];
            if(xxx.attributes['src'].value == ""){
              let imagemClicada = celula.children[0];
              let imagemDataBase = imagemClicada.attributes['src'].value;
              let imagemFilha = imagemClicada.attributes.posicaodaceluladaimagemnatabela.value;
              let imagemPai = xxx.attributes.posicaodaceluladaimagemnatabela.value;

              xxx.attributes['src'].value = imagemDataBase;
              xxx.attributes.posicaodaceluladaimagemnatabela.value = imagemFilha;

              imagemClicada.attributes['src'].value = "";
              imagemClicada.attributes.posicaodaceluladaimagemnatabela.value = imagemPai;


            }
          }

          if(celulaAcima != null){
            var xxx = celulaAcima.children[0];
            if(xxx.attributes['src'].value == ""){
              let imagemClicada = celula.children[0];
               let imagemDataBase = imagemClicada.attributes['src'].value;
               let imagemFilha = imagemClicada.attributes.posicaodaceluladaimagemnatabela.value;
               let imagemPai = xxx.attributes.posicaodaceluladaimagemnatabela.value;

               xxx.attributes['src'].value = imagemDataBase;
               xxx.attributes.posicaodaceluladaimagemnatabela.value = imagemFilha;

               imagemClicada.attributes['src'].value = "";
               imagemClicada.attributes.posicaodaceluladaimagemnatabela.value = imagemPai;
            }
          }

          if(celulaAbaixo != null){
            var xxx = celulaAbaixo.children[0]; 
            if(xxx.attributes['src'].value == ""){
              let imagemClicada = celula.children[0];
              let imagemDataBase = imagemClicada.attributes['src'].value;
              let imagemFilha = imagemClicada.attributes.posicaodaceluladaimagemnatabela.value;
              let imagemPai = xxx.attributes.posicaodaceluladaimagemnatabela.value;

              xxx.attributes['src'].value = imagemDataBase;
              xxx.attributes.posicaodaceluladaimagemnatabela.value = imagemFilha;

              imagemClicada.attributes['src'].value = "";
              imagemClicada.attributes.posicaodaceluladaimagemnatabela.value = imagemPai;
            }
          }
          
          let ganhouOJogo = verificarSeGanhou();
          if (ganhouOJogo) {
            alert("Parabéns! Você Ganhou!");
          }
        });
        celula.appendChild(img);
        linha.appendChild(celula);
        index++; 
      }
     
      tabela.appendChild(linha);
    }
  
    return matriz;
  }
  
  let larguraDaImagem;
  let alturaDaImagem;
  // Exemplo de uso
  var imagemOriginal = new Image();
  imagemOriginal.src = 'img/imges.jpg';
  
  imagemOriginal.onload = function() {
    var partesRecortadas = recortarImagem(imagemOriginal);
    var partesEmbaralhadas = embaralharPartes(partesRecortadas);
    var matrizPartes = adicionarPartesNaMatriz(partesEmbaralhadas); 
  };

  const ola = () => {
    var tabela = document.getElementById("tabela");
    tabela.innerHTML = "";
    tabela.style.backgroundImage = "url('img/imges.jpg')"; 
    // Define outras propriedades de estilo, se necessário
    tabela.style.width = larguraDaImagem+"px";
    tabela.style.height = alturaDaImagem+"px";
  }
  
  const reiniciar = () => {
    var tabela = document.getElementById("tabela");
    tabela.style.backgroundImage = "url('')";
    imagemOriginal.onload();
    
  }

  const verificarSeGanhou = () => {
    var tabela = document.getElementById("tabela");

    // Obtém todas as linhas da tabela
    var linhas = tabela.getElementsByTagName("tr");
    let ganhouOJogo = false;
    // Itera sobre as linhas
    for (var i = 0; i < linhas.length; i++) {
        // Obtém todas as células da linha atual
        var celulas = linhas[i].getElementsByTagName("td");

         
          for (var j = 0; j < celulas.length; j++) {
            let posicaoDaCelula = linhas[i].cells[j].attributes.posicaodacelulanatabela.value;
            let posicaoDaImagem = celulas[j].children[0].attributes.posicaodaceluladaimagemnatabela.value
            
            ganhouOJogo = parseInt(posicaoDaCelula) == parseInt(posicaoDaImagem) ? true : false;

            if(!ganhouOJogo){
              return ganhouOJogo;
            }
          } 
           
    }

    return ganhouOJogo;
  }