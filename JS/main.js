// Função para recortar a imagem em 9 partes iguais
function recortarImagem(imagem, dimensaoDoTabuleiro) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
     larguraDaImagem = imagem.width;
     alturaDaImagem = imagem.height;
     canvas.width = larguraDaImagem / dimensaoDoTabuleiro;
     canvas.height = alturaDaImagem / dimensaoDoTabuleiro;
  
    var partes = [];
    
    for (var i = 0; i < dimensaoDoTabuleiro; i++) {
      let posicaoImagem = i;
      for (var j = 0; j < dimensaoDoTabuleiro; j++) {
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
  function adicionarPartesNaMatriz(partes,dimensaoDoTabuleiro) {
    var tabuleiro = document.getElementById('tabuleiro');
  
    var matriz = [];
    var index = 0;
  
    for (var i = 0; i < dimensaoDoTabuleiro; i++) {
      var linha = document.createElement('tr'); 
      for (var j = 0; j < dimensaoDoTabuleiro; j++) {
        var celula = document.createElement('td');  
        celula.setAttribute('posicaoDaCelulaNaTabela', index);
        var img = document.createElement('img');
       
        img.src = partes[index].src;
        img.className = 'parte-imagem';
        img.setAttribute('linha', i);
        img.setAttribute('coluna', j);  
        img.setAttribute('posicaoDaCelulaDaImagemNaTabela', partes[index].posicaoImagem);
        img.addEventListener('click', function() { 

          let spanContadorDeJogada = document.getElementById("contadorDeJogada"); 
          spanContadorDeJogada.textContent = contadorDeJogada++;
          var tabuleiro = document.getElementById("tabuleiro");

          // Supondo que você queira a célula da terceira linha e segunda coluna
          var linha = $(this).attr('linha');  
          var coluna = $(this).attr('coluna'); 

          // linha 
           
          var celula = tabuleiro.rows[linha].cells[coluna];
          let celulaEsquerda = tabuleiro.rows[linha].cells[parseInt(coluna) -1 ] != undefined ? tabuleiro.rows[linha].cells[parseInt(coluna) -1 ] : null;
          let celulaDireita =  tabuleiro.rows[linha].cells[parseInt(coluna) + 1 ] != undefined ? tabuleiro.rows[linha].cells[parseInt(coluna) + 1]: null;
          let celulaAcima = tabuleiro.rows[parseInt(linha) - 1] != undefined ? tabuleiro.rows[parseInt(linha) - 1].cells[coluna] : null;
          let celulaAbaixo = tabuleiro.rows[parseInt(linha) + 1] != undefined ? tabuleiro.rows[parseInt(linha) + 1].cells[coluna] : null;

            
          
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
     
      tabuleiro.appendChild(linha);
    }
  
    return matriz;
  }
  
  let larguraDaImagem;
  let alturaDaImagem;
  // Exemplo de uso
  var imagemOriginal = new Image();
  imagemOriginal.src = 'img/imges.jpg';
  
 // imagemOriginal.onload = function() {
 //   var partesRecortadas = recortarImagem(imagemOriginal);
 //   var partesEmbaralhadas = embaralharPartes(partesRecortadas);
 //   var matrizPartes = adicionarPartesNaMatriz(partesEmbaralhadas); 
 // };

  const ola = () => {
    var tabela = document.getElementById("tabuleiro");
    tabela.innerHTML = "";
    tabela.style.backgroundImage = "url('img/imges.jpg')"; 
    // Define outras propriedades de estilo, se necessário
    tabela.style.width = larguraDaImagem+"px";
    tabela.style.height = alturaDaImagem+"px";
  }
  
 let contadorDeJogada = 1;

  const verificarSeGanhou = () => {
    var tabuleiro = document.getElementById("tabuleiro");

    // Obtém todas as linhas da tabela
    var linhas = tabuleiro.getElementsByTagName("tr");
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

  const iniciarJogo = () => {
    limparTabuleiro();
    let dimensaoDoTabuleiro =  dimensaoTabuleiroPorNivelDifculdade();

    let imagemSelecionada = new Image();
     imagemSelecionada.src = pegarSrcDaImagemSelecionada();

    let partesRecortadas = recortarImagem(imagemSelecionada, dimensaoDoTabuleiro);
    let  partesEmbaralhadas = embaralharPartes(partesRecortadas);
    adicionarPartesNaMatriz(partesEmbaralhadas,dimensaoDoTabuleiro);  
  }

  const limparTabuleiro = () => {
    let  tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
  }

  $( document ).ready(function() {
    iniciarJogo();
});

const dimensaoTabuleiroPorNivelDifculdade = () => {
  let radios = document.getElementsByName('nivel');
  let srcDaImagemSelecionada = pegarSrcDaImagemSelecionada();

  for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) { 
          return radios[i].value ;
      }
  }
}

const pegarSrcDaImagemSelecionada = () => {
  let radioDaImagem = document.getElementsByName('image');

  for (let i = 0; i < radioDaImagem.length; i++) {
      if (radioDaImagem[i].checked) { 
        let imagemSelecionada = radioDaImagem[i].nextElementSibling;
          return imagemSelecionada.attributes.src.value ;
      }
  }
}