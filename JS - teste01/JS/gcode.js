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
    var texto = "N"+imprimirGCODE.contador.toString()+" "
    if (imprimirGCODE.contador==-1){
        texto+="M110\r\n"
    }else{
        if (imprimirGCODE.valor!=""){
            while (imprimirGCODE.valor[0]==";"){
                imprimirGCODE.valor=imprimirGCODE.valor.slice(imprimirGCODE.valor.indexOf("\n")+1)
            }
            if ((imprimirGCODE.valor.indexOf("\n")<imprimirGCODE.valor.indexOf(";"))||!imprimirGCODE.valor.includes(";")){
                texto += imprimirGCODE.valor.substring(0,imprimirGCODE.valor.indexOf("\n")+1)
            }else{
                texto += imprimirGCODE.valor.substring(0,imprimirGCODE.valor.indexOf(";")-1) +"\r\n"
            }
            imprimirGCODE.valor=imprimirGCODE.valor.slice(imprimirGCODE.valor.indexOf("\n")+1)
        }else{
            imprimirGCODE.status==0
            return
        }
    }
    writeCOM(texto)
    imprimirGCODE.contador++
}
