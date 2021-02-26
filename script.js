const qs = (e) => document.querySelector(e);
const qsAll = (e) => document.querySelectorAll(e);


//variáveis dos elementos visuais
let votoPara = qs('.voto span');
let info = qs('.info');
let conteudo2 = qs('.conteudo-2');
let imagem = qsAll('.imagem');
let numeroSpan = qs('.numero-area span');
let numeros = qs('.numeros');
let botoes = qsAll('.btn');

//Armazena o numero digitado
let numero = '';
//Variável que valida voto branco
let votoBranco = false;
//Variável que valida voto nulo
let votoNulo = false;
//Variável que armazena a etapa atual de voto 
let etapaAtual = 0;
//Variável que armazena os votos
let votos = [];


botoes.forEach((element)=>{
    //adiciona o evento de clique aos botões
    element.addEventListener('click', ()=>{
        //efeito visual ao clicar
        element.classList.add('clique');
        setTimeout(()=>
        element.classList.remove('clique'), 
        200);
        //som de clique
        somClique();

        //armazena o valor do botão
        let valor = element.getAttribute('key');

        //executa a ação do botão
        if(valor <= 9){
            adicionarValor(valor);
        }
        if(valor == 'corrige'){
            corrige();
        }if(valor == 'branco'){
            branco();
        }
        if(valor == 'confirma'){
            confirma();
        }
        
    });
});

iniciar();

//inicia as estapas de votação
function iniciar(){
    hiddenInfo();

    numero = '';
    votoBranco = false;
    votoNulo = false;
    numeros.style.display = 'flex';

    let etapa = etapas[etapaAtual];  
    if(etapa){
        for(let i = 0; i < etapa.numeros; i++){
            let campo = document.createElement('div');
            campo.classList.add('numero')
            if(i == 0){
                campo.classList.add('selecionado');
                numeros.append(campo);
            }else{
                numeros.append(campo);
            }
        }
        qs('.cargo').innerHTML = etapa.titulo;
    }
    
}

//Adiciona o valor na variável numero e insere na tela
function adicionarValor(valor){
    let numeroCampo = qs('.numero.selecionado')
    
    if(numeroCampo != null){
        numeroCampo.innerHTML = valor;
        numero += valor;
        
        //marcador do campo selecionado
        numeroCampo.classList.remove('selecionado');
        if(numeroCampo.nextSibling != null){
            numeroCampo.nextElementSibling.classList.add('selecionado');
        }else{
            atualizarTela();
        }
    }
}

//
function branco(){
    if(numero == ''){
        votoPara.style.display = 'block';
        conteudo2.style.display = 'block';
        numeros.style.display = 'none';
        info.querySelector('.aviso').innerHTML = 'VOTO EM BRANCO';
        numero = '';
        votoBranco = true;
    }else{
        alert('Para votar em branco o campo deve estar vazio');
    }
}

//
function corrige(){
    iniciar();
}

//
function Nulo(){
    votoPara.style.display = 'block';
    conteudo2.style.display = 'block';
    numeroSpan.innerHTML = 'Número:';
    info.querySelector('.errado').innerHTML = 'NÚMERO ERRADO';
    info.querySelector('.aviso').innerHTML = 'VOTO NULO';
    numero = '';
    votoNulo = true;
}

//confirma voto
function confirma(){
    let etapa = etapas[etapaAtual];  
    let votoConfirma = false;
    let voto = ''
    if(etapa){
        if(votoBranco){
            votoConfirma = true;
            voto = 'branco';
        }else if(votoNulo){
            votoConfirma = true;
            voto = 'nulo';
        }else if(numero.length == etapa.numeros){
            votoConfirma = true;
            voto = numero;
        }
    }
    
    if(votoConfirma){
        votos.push({
            cargo: etapa.titulo,
            voto : voto
        });
        etapaAtual++;
        if(etapas[etapaAtual]){
            iniciar();
        }else{
            finalizar();
        }
    }
}

//finaliza a simulação
function finalizar(){
    let fim = qs('.tela');
    fim.innerHTML = '';
    setTimeout(function(){
        fim.innerHTML = 'FIM';
        fim.classList.add('fim');
        somFim();
    }, 1000);
    console.log(votos);
    //libera um botão para fazer uma nova simulação
    let botao = qs('.nova-simulacao');
    botao.style.display = 'block';
    botao.addEventListener('click', function(){
        document.location.reload();
    });
    
}

//atualiza a tela após digitar o número
function atualizarTela(){
    let candidato = etapas[etapaAtual].candidatos.find((item)=>{
        return item.numero == numero;
    });
    //se candidato for encontrado chama a função que exibe as informações
    if(candidato){
        showInfo(candidato);
    }else{
        //caso número não encontrado, atribui nulo ao voto
        let numeroCampo = qs('.numero.selecionado');
        if(numeroCampo == null){
            Nulo();
        }
    }
}

//Mostra as informações do candidato na tela
function showInfo(candidato){
    votoPara.style.display = 'block';
    conteudo2.style.display = 'block';
    numeroSpan.innerHTML = 'Número:';
    info.style.display = 'flex';

    info.querySelector('.nome').innerHTML = `Nome: ${candidato.nome}`;
    info.querySelector('.partido').innerHTML = `Partido: ${candidato.partido}`;

    candidato.fotos.forEach((element, index)=>{
        imagem[index].querySelector('img').src = `images/${element.url}`;
        imagem[index].querySelector('span').innerHTML = element.legenda;
        imagem[index].style.display = 'block';
    });

    if(etapaAtual == 1){
        info.querySelector('.vice-nome').innerHTML = `Vice-Prefeito: ${candidato.vice}`;
    }
}

//Oculta as informações
function hiddenInfo(){ 
    numeroSpan.innerHTML = '';
    numeros.innerHTML = '';
    votoPara.style.display = 'none';
    conteudo2.style.display = 'none';
    info.querySelector('.errado').innerHTML = '';
    info.querySelector('.aviso').innerHTML = '';
    info.querySelectorAll('span').forEach((element)=>{
        element.innerHTML = '';
    });
    imagem.forEach((element)=>{
        element.style.display = 'none';
    });
}

//Adiciona o som de clique
function somClique(){
    let audio = new Audio('sounds/button.ogg');
    audio.play();
}

//Adiciona o som de conclusão do voto
function somFim(){
    let audio = new Audio('sounds/fim.mp3');
    audio.play();
}