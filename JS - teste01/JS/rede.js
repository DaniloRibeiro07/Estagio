function SerialOn() {
    document.getElementById("serial/rede").innerHTML ='\n            <p>Clique no botão abaixo para selecionar uma porta serial:</p>\n            <input type="button" name="Porta Selecionada" value="Selecionar Porta Serial" onclick="SelectCOM()"> \x3C!--Botão Solicitar ao usuário a porta serial-->\n            <p id="text-disp-select">Dispositivo selecionado:</p> \x3C!--Texto com o nome do dispositivo-->\n            <p>Nome na rede: <input type="text" id="nome-rede"></p>\n        '    
    document.getElementById("COM").setAttribute("disabled","disabled")
    document.getElementById("REDE").removeAttribute("disabled")
}

function RedeOn() {
    document.getElementById("serial/rede").innerHTML = '\n  <p>  <label for="Impressoras-Rede">Escolha a impressora da rede:</label>\n        <select name="Impressoras-Rede" id="Impressoras-Rede"> </select> </p>'
    document.getElementById("REDE").setAttribute("disabled","disabled")
    document.getElementById("COM").removeAttribute("disabled")
    atualizarRede()
}

async function atualizarRede(){
    if (document.getElementById("REDE").hasAttribute("disabled")){
        fetch("./data/impressoras_cadastrada.txt") //encontra o arquivo com as informações dos dispostivos 
            .then((response) => {
                return response.text();
            })  
            .then((text) => {
                if (atualizarRede.redeAtual!=text){
                    atualizarRede.redeAtual=text
                    document.getElementById("Impressoras-Rede").innerHTML = "<option value='0'>Selecione a impressora</option>"
                    text=text.split('\n')
                    text.pop()
                    while (text.length>0){
                        document.getElementById("Impressoras-Rede").innerHTML += "<option value='"+text[0]+"'>"+text[0]+"</option>"
                        text.shift()
                    }
                }
            }) 
        esperarNomeRede()
    } else{
        atualizarRede.redeAtual=""
    }
}

function esperarNomeRede() {
    return new Promise(resolve => { //cria um objeto de processamento assícrono, 
      setTimeout(() => { //quando o tempo decorrido ao chamar a função for >= 100, pausa gravação
        atualizarRede();
      }, 100);
    });
}

function servidorControle(x){
    if(x=="cadastro"){
        nome_impressora=document.getElementById("nome-rede").value
        const dado=new FormData();
        dado.append("nome_impressora", nome_impressora)
        dado.append("acao",x)
        fetch("./php/atualizarArquivo.php", {
            method: 'post', 
            body: dado
            })
            .then(response => response.json()) 
            .then(json => console.log(json.adicionado));
    }else if(x=="leitura"){

    }
}