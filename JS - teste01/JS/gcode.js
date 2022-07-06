//inicio rotina de inserção de arquivo GCODE
function escolherarquivoGCODE(){
    let botao_arquivo = document.getElementById("Escolher-Arquivo").files[0]; // variavel que recebe o arquivo
    let leitor = new FileReader();//cria um objeto de leitura de arquivo
    leitor.addEventListener("loadend", () => { //cria um evento apos o carregamento do arquivo
        imprimirGCODE.valor = leitor.result; //o arquivo lido será armazenado na variável valor
        imprimirGCODE.contador=-1 //contador inicia em -1
        console.log(imprimirGCODE.valor)  //imrpime no console o texto lido
    });
    leitor.readAsText(botao_arquivo);
}
//fim rotina de inserção de arquivo GCODE

//inicio rotina de impressão
function imprimirGCODE(){
    var texto = ""//variavel que conterá o texto a ser enviado
        if (imprimirGCODE.valor!=""){ //caso o GCODE seja diferente de vazio
            while (imprimirGCODE.valor[0]==";"){ //enquanto o início da linha do gcode iniciar em ;
                imprimirGCODE.valor=imprimirGCODE.valor.slice(imprimirGCODE.valor.indexOf("\n")+1) //remova da variável o que estiver a direita até a quebra
            }
            if ((imprimirGCODE.valor.indexOf("\n")<imprimirGCODE.valor.indexOf(";"))||!imprimirGCODE.valor.includes(";")){  //se o caractere ";" estiver depois da quebra ou se não houver caractere ";", então
                texto = imprimirGCODE.valor.substring(0,imprimirGCODE.valor.indexOf("\n")+1) //atualiza a variável texto com a linha do gcode
            }else{
                texto = imprimirGCODE.valor.substring(0,imprimirGCODE.valor.indexOf(";")-1) +"\r\n" //atualiza a variável texto com a linha do gcode até o caractere ;
            }
            imprimirGCODE.valor=imprimirGCODE.valor.slice(imprimirGCODE.valor.indexOf("\n")+1) //remove a linha do arquivo
            if (LigarVideo.status==1 ){ //se a câmera estiver ligada
                if (LigarVideo.mediaRecorder.state=="paused" && texto.includes("Z")){ //se a gravação estiver pausada e no texto de envio do gcode para a impressora houver "Z"
                    const inicioZ=texto.indexOf("Z")+1 //encontra a posição do Z no texto
                    var fimZ=texto.indexOf(" ", inicioZ) //encontra a posição do espaço após o Z
                    //console.log(fimZ)
                    if (fimZ==-1){ //se não houver espaço logo após o parâmetro Z, encontre a quebra de linha
                        fimZ=texto.indexOf("\n", inicioZ)
                    }
                    const atualZposi=texto.substring(inicioZ,fimZ) //recupera o valor atual da posição Z
                    if (atualZposi!=imprimirGCODE.Zposi){ //se a posição Z atual for diferente da ultima variação da posição Z, 
                        imprimirGCODE.Zposi=atualZposi //atualize a ultima posição Z
                        //console.log(texto) 
                        LigarVideo.mediaRecorder.resume() //grave um take
                    }
                }
            }
            writeCOM(texto) //envie a mensagem para a impressora
            imprimirGCODE.contador++ //incrementa contador
        }else{ //situação do gcode vazio
            PausarGravacao.status=1 //define que será o ultimo take
            LigarVideo.mediaRecorder.resume() //inicia a gravação
            return
        }
}
//Fim da rotina de impressão


//inicio rotina de inserção de arquivo GCODE
LigarVideo.status=0 //garante a definição da variável status de não iniciado
function forcarGCODE(){
    if (LigarVideo.status==1 ){  //caso a camera esteja ligada
        if (LigarVideo.mediaRecorder.state=="inactive"){ //se o status da gravação for inativo
            LigarVideo.mediaRecorder.start() //inicie
        }
    }
    imprimirGCODE.status=1 //variável de controle, define que está imprimindo
    imprimirGCODE() //inicia a impressão
}
//fim rotina de inserção de arquivo GCODE