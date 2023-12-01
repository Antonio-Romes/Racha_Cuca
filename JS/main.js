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
    let partesEmbaralhadas = partes.slice(); // Faz uma cópia das partes
  
    for (let i = partesEmbaralhadas.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = partesEmbaralhadas[i];
      partesEmbaralhadas[i] = partesEmbaralhadas[j];
      partesEmbaralhadas[j] = temp;
    }
  
    return partesEmbaralhadas;
  }
   
  function adicionarPartesNaMatriz(partes,dimensaoDoTabuleiro) {
    let tabuleiro = document.getElementById('tabuleiro');
  
    let matriz = [];
    let index = 0;
  
    for (let i = 0; i < dimensaoDoTabuleiro; i++) {
      let linha = document.createElement('tr'); 
      for (let j = 0; j < dimensaoDoTabuleiro; j++) {
        let celula = document.createElement('td');  
        celula.setAttribute('posicaoDaCelulaNaTabela', index);
        let img = document.createElement('img');
       
        img.src = partes[index].src;
        img.className = 'parte-imagem';
        img.setAttribute('linha', i);
        img.setAttribute('coluna', j);  
        img.setAttribute('posicaoDaCelulaDaImagemNaTabela', partes[index].posicaoImagem);
        img.addEventListener('click', function() { 

          let spanContadorDeJogada = document.getElementById("contadorDeJogada"); 
          spanContadorDeJogada.textContent = "Total de jogodas : "+ contadorDeJogada++;
          let tabuleiro = document.getElementById("tabuleiro");
 
          let linha = $(this).attr('linha');  
          let coluna = $(this).attr('coluna'); 
 
          let celula = tabuleiro.rows[linha].cells[coluna];
          let celulaEsquerda = tabuleiro.rows[linha].cells[parseInt(coluna) -1 ] != undefined ? tabuleiro.rows[linha].cells[parseInt(coluna) -1 ] : null;
          let celulaDireita =  tabuleiro.rows[linha].cells[parseInt(coluna) + 1 ] != undefined ? tabuleiro.rows[linha].cells[parseInt(coluna) + 1]: null;
          let celulaAcima = tabuleiro.rows[parseInt(linha) - 1] != undefined ? tabuleiro.rows[parseInt(linha) - 1].cells[coluna] : null;
          let celulaAbaixo = tabuleiro.rows[parseInt(linha) + 1] != undefined ? tabuleiro.rows[parseInt(linha) + 1].cells[coluna] : null;

          trocarImagemDePosicao(celula,celulaEsquerda);  
          trocarImagemDePosicao(celula,celulaDireita);  
          trocarImagemDePosicao(celula,celulaAcima);  
          trocarImagemDePosicao(celula,celulaAbaixo);  
          
          let ganhou = verificarSeGanhou();
          if (ganhou) {
            ganhouOJogo(); 
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
    
  
 let contadorDeJogada = 1;

  const verificarSeGanhou = () => {
    var tabuleiro = document.getElementById("tabuleiro"); 
    var linhas = tabuleiro.getElementsByTagName("tr");
    let ganhouOJogo = false; 
    for (var i = 0; i < linhas.length; i++) { 
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
    mostrarTabuleiro();
    mostrarOuOcultarBotoes();
    criarTabuleiroComImagem(); 
  }

  const criarTabuleiroComImagem = () => {
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

const mostrarTabuleiro = () =>{
  mostrarOuOcultarElemento();
}

const configurarJogo = () =>{
  mostrarOuOcultarElemento();
  mostrarOuOcultarBotoes();
}

const mostrarOuOcultarElemento = () => {
  let  secaoTabuleiro = document.getElementById("secaoTabuleiro");
  let  secaoConfiguracao = document.getElementById("secaoConfiguracao");
  let  imagemAjudar = document.getElementById("imagemAjudar");

  secaoTabuleiro.toggleAttribute("hidden");
  secaoConfiguracao.toggleAttribute("hidden");
  imagemAjudar.toggleAttribute("hidden"); 
}

const mostrarOuOcultarBotoes = () => {
  let configurarJogo = document.getElementById("configurarJogo");
  let reiniciarJogo = document.getElementById("reiniciarJogo");
  let iniciarJogo = document.getElementById("iniciarJogo");
  let contadorDeJogada = document.getElementById("contadorDeJogada"); 

  configurarJogo.toggleAttribute("hidden");
  reiniciarJogo.toggleAttribute("hidden");
  iniciarJogo.toggleAttribute("hidden");
  contadorDeJogada.toggleAttribute("hidden"); 
}

const reiniciarJogo = () =>{
  limparTabuleiro();
  criarTabuleiroComImagem();
  zeraContadorDeJogada();
}

const zeraContadorDeJogada = () =>{
  contadorDeJogada = 0 ;
  let spanContadorDeJogada = document.getElementById("contadorDeJogada"); 
      spanContadorDeJogada.textContent = "Total de jogodas : " + contadorDeJogada;
}

const imagemAjudar = () => {
  let imageAjuda = document.getElementById("imageAjuda"); 
  imageAjuda.toggleAttribute("hidden"); 
  imageAjuda.src = pegarSrcDaImagemSelecionada();
}

const ganhouOJogo = () => {
  $('#modalGanhouOJogo').modal('show');
}

const trocarImagemDePosicao = (celula , celulaClicada) => {
  if(celulaClicada != null){
    var imagem = celulaClicada.children[0];
    if(imagem.attributes['src'].value == ""){

       let imagemClicada = celula.children[0];
       let imagemDataBase = imagemClicada.attributes['src'].value;
       let imagemFilha = imagemClicada.attributes.posicaodaceluladaimagemnatabela.value;
       let imagemPai = imagem.attributes.posicaodaceluladaimagemnatabela.value;

       imagem.attributes['src'].value = imagemDataBase;
       imagem.attributes.posicaodaceluladaimagemnatabela.value = imagemFilha;

       imagemClicada.attributes['src'].value = "";
       imagemClicada.attributes.posicaodaceluladaimagemnatabela.value = imagemPai;
    }
  }
}