        //inicio rotina de selecionar porta serial
        async function SelectCOM(){
            try{
                SelectCOM.port = await navigator.serial.requestPort() //solicitar a porta serial ao usuário
                desconectCOM.valor=0 //variável de controle de desconexão
                InformacoesDisp() //recupera informações do chip de comunicação
            }catch (error){

            }
        }
        //fim rotina de selecionar porta serial

        //inicio rotina de econtrar informações do chip de conexão
        async function InformacoesDisp(){
            fetch("./data/usb.ids.txt") //encontra o arquivo com as informações dos dispostivos 
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                let fabricante="Dispositivo Serial"
                let produto=fabricante
                try {
                    const vendorID=SelectCOM.port.getInfo().usbVendorId.toString(16) //converter em Hex os caracteres decimais do vendedor
                    const productID=SelectCOM.port.getInfo().usbProductId.toString(16) //converter em Hex os caracteres decimais do produto
                    const inicio_vendor=text.indexOf("\n"+vendorID)+("\n"+vendorID).length+2 //posição de inicio do vendedor
                    if (inicio_vendor!=-1){ //caso não haja vendedor identificado
                        const fim_vendor=text.indexOf('\n',inicio_vendor) //identificação do nome final do vendedor
                        const inicio_product=text.indexOf(productID,fim_vendor)+(productID).length+2 //identificaçãoda posição inicial do produto
                        if (inicio_product!=1){ //se o produto for encontrado, defina dispositivo o fabricante e o produto
                            fabricante=text.substring(inicio_vendor,fim_vendor)
                            fim_product=text.indexOf('\n',inicio_product)
                            produto=text.substring(inicio_product,fim_product)
                        }
                    }
                } catch (error) {
                }
                var texto=document.getElementById("text-disp-select") //atualiza o nom da impressora
                if (fabricante!=produto){
                    texto.innerHTML = "Dispositivo selecionado: "  + fabricante + " - " + produto
                }else{
                    texto.innerHTML ="Dispositivo selecionado: " + fabricante
                }
            });
        }
        //Fim rotina de econtrar informações do chip de conexão

        //inicio rotina de conexão serial
        async function ConectCOM(){
            var texto = document.getElementById("text-status")
            try{ //tenta conectar com a impressora com as configurações programadas
                await SelectCOM.port.open({baudRate:(115200),bufferSize:(255),dataBits:(8),flowControl:("none"),parity:("none"),stopBits:(1)})
                texto.innerHTML = "Status: Conectado"
                writeCOM.escrita = SelectCOM.port.writable.getWriter(); //cria um fluxo de escrita
                readCOM(); //chama a função de leitura da porta serial
            }catch (erro){
                texto.innerHTML = "Status: "+erro +" selecione outra porta e tente novamente."
            }
        }
        //fim rotina de conexão serial

        //inicio rotina de leitura serial
        async function readCOM(){
            readCOM.texto="" //variável de texto lido
            while (SelectCOM.port.readable) { //enquanto a leitura estiver disponível
                window.reader = SelectCOM.port.readable.getReader(); //variável com o fluxo de leitura
                try { //tente 
                    while (true) {
                        const { value, done } = await reader.read()
                        var caractere=new TextDecoder().decode(value)
                        //var caixa =document.getElementById('text-area-read')
                        //caixa.scrollTop = caixa.scrollHeight;
                        //caixa.value += caractere;
                        readCOM.texto +=caractere;
                        //console.log(readCOM.texto.includes("ok"))
                        if (readCOM.texto=="start\r\n"){ //"se for lido start", screva M105
                            writeCOM("M105\r\n")
                        }
                        if (readCOM.texto.includes("ok") && imprimirGCODE.status==1) { //se for lido "ok e a impressão esteja acontecendo"
                            imprimirGCODE()
                        }
                        if (readCOM.texto.includes("\n")){ //se houver quebra no texto, atualizar texto para vazio
                            readCOM.texto=""
                        }
                        if (desconectCOM.valor==1){ //se desconexão for igual a 1, desconexte
                            break
                        }
                        if (done) {
                            break;
                        }
                    }
                } catch (error) {
                } finally {
                    reader.releaseLock(); //remover fluxo de faixa serial de leitura
                    break
                }
            }
            desconectCOM()
        }
        //fim rotina de leitura serial

        //inicio rotina de escrita serial
        async function writeCOM(value){
            //console.log(value)
            const encoder = new TextEncoder(); //cria um objeto de codificador
            const texto = value.toUpperCase(); //deixa em maiuculo o texto a ser enviado
            await writeCOM.escrita.write(encoder.encode(texto)); //envia texto codificado
            //var caixa =document.getElementById('text-area-write')
            //caixa.scrollTop = caixa.scrollHeight;
            //caixa.value += texto;
        }
        //fim rotina de escrita serial

        //inicio rotina de desconexão serial
        async function desconectCOM(){
            var texto = document.getElementById("text-status") //identifica a tag com o texto de status de conexão
            try{ //tenta realizar a desconexão, falhando é informado o motivo na tag com o texto
                await SelectCOM.port.close()
                desconectCOM.valor=0
                texto.innerHTML = "Status: Desconectado"
            }catch (erro){
                texto.innerHTML = "Status: "+erro 
            }            
        }
        //fim rotina de desconexão serial
