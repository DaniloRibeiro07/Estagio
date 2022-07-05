function escolherarquivoGCODE(){
    let botao_arquivo = document.getElementById("Escolher-Arquivo").files[0];
    let leitor = new FileReader();
    leitor.addEventListener("loadend", () => {
        imprimirGCODE.valor = leitor.result;
        imprimirGCODE.contador=-1
        console.log(imprimirGCODE.valor)  
    });
    leitor.readAsText(botao_arquivo);
}

function imprimirGCODE(){
        if (imprimirGCODE.valor!=""){
            while (imprimirGCODE.valor[0]==";"){
                imprimirGCODE.valor=imprimirGCODE.valor.slice(imprimirGCODE.valor.indexOf("\n")+1)
            }
            if ((imprimirGCODE.valor.indexOf("\n")<imprimirGCODE.valor.indexOf(";"))||!imprimirGCODE.valor.includes(";")){
                texto = imprimirGCODE.valor.substring(0,imprimirGCODE.valor.indexOf("\n")+1)
            }else{
                texto = imprimirGCODE.valor.substring(0,imprimirGCODE.valor.indexOf(";")-1) +"\r\n"
            }
            imprimirGCODE.valor=imprimirGCODE.valor.slice(imprimirGCODE.valor.indexOf("\n")+1)
            if (LigarVideo.status==1 ){
                if (LigarVideo.mediaRecorder.state=="paused" && texto.includes("Z")){
                    const inicioZ=texto.indexOf("Z")+1
                    var fimZ=texto.indexOf(" ", inicioZ)
                    console.log(fimZ)
                    if (fimZ==-1){
                        fimZ=texto.indexOf("\n", inicioZ)
                    }
                    const atualZposi=texto.substring(inicioZ,fimZ)
                    if (atualZposi!=imprimirGCODE.Zposi){
                        imprimirGCODE.Zposi=atualZposi
                        console.log(texto)
                        LigarVideo.mediaRecorder.resume()
                    }
                }
            }
            writeCOM(texto)
            imprimirGCODE.contador++
        }else{
            console.log("entrei")
            PausarGravacao.status=1
            LigarVideo.mediaRecorder.resume()
            return
        }
}

LigarVideo.status=0

function forcarGCODE(){
    if (LigarVideo.status==1 ){
        if (LigarVideo.mediaRecorder.state=="inactive"){
            LigarVideo.mediaRecorder.start()
        }
    }
    imprimirGCODE.status=1
    imprimirGCODE()
}